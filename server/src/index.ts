import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Context } from 'hono';
import { getDb } from './db';
import type { User, ApiResponse, GeneratedPlan } from '../../shared/src/index';
import { generatePlan } from './ai/planGenerator';
import { analyzeDocument, categorizeByFilename } from './ai/documentAnalyzer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const JWT_SECRET = process.env.JWT_SECRET || 'lifectrl-dev-secret-change-in-production';

const app = new Hono();
app.use('/*', cors({
  origin: 'https://www.mylifectrl.com',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// ── Auth Middleware ──
async function authMiddleware(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json<ApiResponse>({ ok: false, error: 'Unauthorized' }, 401);
  }
  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    c.set('userId', payload.userId);
    await next();
  } catch {
    return c.json<ApiResponse>({ ok: false, error: 'Invalid token' }, 401);
  }
}

// ── Health ──
app.get('/api/health', (c) => {
  return c.json({ ok: true, data: { status: 'healthy', version: '0.1.0' } });
});

// ── Auth Routes ──
app.post('/api/auth/signup', async (c) => {
  const body = await c.req.json();
  const { email, name, password } = body;

  if (!email || !name || !password) {
    return c.json<ApiResponse>({ ok: false, error: 'Email, name, and password are required' }, 400);
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return c.json<ApiResponse>({ ok: false, error: 'Email already registered' }, 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = db.prepare(
    'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)'
  ).run(email, name, passwordHash);

  const user = db.prepare('SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?').get(result.lastInsertRowid) as User;
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  return c.json({ ok: true, data: { user, token } });
});

app.post('/api/auth/login', async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return c.json<ApiResponse>({ ok: false, error: 'Email and password are required' }, 400);
  }

  const db = getDb();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!row) {
    return c.json<ApiResponse>({ ok: false, error: 'Invalid email or password' }, 401);
  }

  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) {
    return c.json<ApiResponse>({ ok: false, error: 'Invalid email or password' }, 401);
  }

  const user: User = {
    id: row.id,
    email: row.email,
    name: row.name,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  return c.json({ ok: true, data: { user, token } });
});

app.post('/api/auth/logout', authMiddleware, (c) => {
  return c.json({ ok: true, data: { message: 'Logged out successfully' } });
});

// ── Plans Routes ──
app.get('/api/plans', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const plans = db.prepare(
    'SELECT id, user_id, title, description, situation, status, disclaimer, created_at, updated_at FROM plans WHERE user_id = ? ORDER BY updated_at DESC'
  ).all(userId);

  // For each plan, get task count
  const plansWithCounts = (plans as any[]).map((plan) => {
    const taskCount = (db.prepare('SELECT COUNT(*) as count FROM tasks WHERE plan_id = ?').get(plan.id) as any).count;
    const completedCount = (db.prepare("SELECT COUNT(*) as count FROM tasks WHERE plan_id = ? AND status = 'completed'").get(plan.id) as any).count;
    return { ...plan, taskCount, completedCount };
  });

  return c.json({ ok: true, data: plansWithCounts });
});

app.post('/api/plans', authMiddleware, async (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const body = await c.req.json();
  const { title, situation } = body;

  if (!situation || !situation.trim()) {
    return c.json<ApiResponse>({ ok: false, error: 'Please describe your situation so we can build your plan.' }, 400);
  }

  // Generate the plan via AI
  let generated: GeneratedPlan;
  try {
    generated = await generatePlan(situation.trim());
  } catch (err: any) {
    const message = err.message || 'Plan generation failed. Please try again.';
    return c.json<ApiResponse>({ ok: false, error: message }, 500);
  }

  // Insert plan
  const planTitle = title?.trim() || generated.title;
  const result = db.prepare(
    'INSERT INTO plans (user_id, title, description, situation, disclaimer) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, planTitle, generated.description, situation.trim(), generated.disclaimer);

  const planId = result.lastInsertRowid;

  // Insert tasks
  const insertTask = db.prepare(
    'INSERT INTO tasks (plan_id, title, description, priority, status, category, resources, estimated_time, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const now = new Date();
  for (const task of generated.tasks) {
    // Calculate a due date based on priority
    let dueDate: string | null = null;
    const daysFromNow = task.priority >= 5 ? 1 : task.priority === 4 ? 3 : task.priority === 3 ? 7 : task.priority === 2 ? 14 : 30;
    const due = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
    dueDate = due.toISOString().split('T')[0];

    insertTask.run(
      planId,
      task.title,
      task.description,
      task.priority,
      'pending',
      task.category,
      JSON.stringify(task.resources),
      task.estimated_time,
      dueDate
    );
  }

  // Return full plan with tasks
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId) as any;
  const tasks = db.prepare('SELECT * FROM tasks WHERE plan_id = ? ORDER BY priority DESC, due_date ASC').all(planId);

  return c.json({ ok: true, data: { ...plan, tasks } }, 201);
});

app.get('/api/plans/:id', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const planId = c.req.param('id');

  const plan = db.prepare('SELECT * FROM plans WHERE id = ? AND user_id = ?').get(planId, userId) as any;
  if (!plan) {
    return c.json<ApiResponse>({ ok: false, error: 'Plan not found' }, 404);
  }

  const tasks = db.prepare('SELECT * FROM tasks WHERE plan_id = ? ORDER BY priority DESC, due_date ASC').all(planId);
  const documents = db.prepare('SELECT * FROM documents WHERE user_id = ?').all(userId);

  // Parse resources JSON for each task
  const tasksWithResources = (tasks as any[]).map((task) => {
    let resources: string[] = [];
    if (task.resources) {
      try {
        resources = JSON.parse(task.resources);
      } catch {
        resources = [];
      }
    }
    return { ...task, resources };
  });

  return c.json({ ok: true, data: { ...plan, tasks: tasksWithResources, documents } });
});

// ── Tasks Routes (nested) ──
app.get('/api/plans/:id/tasks', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const planId = c.req.param('id');

  const plan = db.prepare('SELECT id FROM plans WHERE id = ? AND user_id = ?').get(planId, userId);
  if (!plan) {
    return c.json<ApiResponse>({ ok: false, error: 'Plan not found' }, 404);
  }

  const tasks = db.prepare('SELECT * FROM tasks WHERE plan_id = ? ORDER BY priority DESC, due_date ASC').all(planId);
  return c.json({ ok: true, data: tasks });
});

app.post('/api/plans/:id/tasks', authMiddleware, async (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const planId = c.req.param('id');
  const body = await c.req.json();

  const plan = db.prepare('SELECT id FROM plans WHERE id = ? AND user_id = ?').get(planId, userId);
  if (!plan) {
    return c.json<ApiResponse>({ ok: false, error: 'Plan not found' }, 404);
  }

  const { title, description, priority, due_date } = body;
  if (!title) {
    return c.json<ApiResponse>({ ok: false, error: 'Title is required' }, 400);
  }

  const result = db.prepare(
    'INSERT INTO tasks (plan_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)'
  ).run(planId, title, description || '', priority || 0, due_date || null);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  return c.json({ ok: true, data: task }, 201);
});

// PATCH /api/plans/:id/tasks/:taskId — update task
app.patch('/api/plans/:id/tasks/:taskId', authMiddleware, async (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const planId = c.req.param('id');
  const taskId = c.req.param('taskId');

  // Verify plan belongs to user
  const plan = db.prepare('SELECT id FROM plans WHERE id = ? AND user_id = ?').get(planId, userId);
  if (!plan) {
    return c.json<ApiResponse>({ ok: false, error: 'Plan not found' }, 404);
  }

  // Verify task belongs to plan
  const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND plan_id = ?').get(taskId, planId) as any;
  if (!existingTask) {
    return c.json<ApiResponse>({ ok: false, error: 'Task not found' }, 404);
  }

  const body = await c.req.json();
  const updates: string[] = [];
  const values: any[] = [];

  if (body.completed !== undefined) {
    updates.push("status = ?");
    values.push(body.completed ? 'completed' : 'pending');
  }
  if (body.status !== undefined) {
    if (!updates.includes("status = ?")) {
      updates.push("status = ?");
      values.push(body.status);
    }
  }
  if (body.priority !== undefined) {
    updates.push("priority = ?");
    values.push(body.priority);
  }
  if (body.title !== undefined) {
    updates.push("title = ?");
    values.push(body.title);
  }
  if (body.description !== undefined) {
    updates.push("description = ?");
    values.push(body.description);
  }
  if (body.due_date !== undefined) {
    updates.push("due_date = ?");
    values.push(body.due_date);
  }
  if (body.category !== undefined) {
    updates.push("category = ?");
    values.push(body.category);
  }
  if (body.resources !== undefined) {
    updates.push("resources = ?");
    values.push(typeof body.resources === 'string' ? body.resources : JSON.stringify(body.resources));
  }
  if (body.estimated_time !== undefined) {
    updates.push("estimated_time = ?");
    values.push(body.estimated_time);
  }

  if (updates.length === 0) {
    return c.json<ApiResponse>({ ok: false, error: 'No fields to update' }, 400);
  }

  updates.push("updated_at = datetime('now')");
  values.push(taskId);

  db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId) as any;
  return c.json({ ok: true, data: task });
});

// ── Documents Routes ──
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(import.meta.dirname, '..', 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function getFileType(mimeType: string, filename: string): string {
  // Strip charset and other parameters from mime type
  const cleanMime = (mimeType || '').split(';')[0].trim();
  if (cleanMime) return cleanMime;
  const ext = path.extname(filename).toLowerCase();
  const extMap: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
    '.eml': 'message/rfc822',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return extMap[ext] || 'application/octet-stream';
}

function getFileSizeDisplay(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// GET /api/docs — list documents with optional filters
app.get('/api/docs', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const category = c.req.query('category');
  const search = c.req.query('search');

  let query = 'SELECT id, user_id, filename, original_name, category, summary, file_type, file_size, key_details, ai_processed, created_at FROM documents WHERE user_id = ?';
  const params: any[] = [userId];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search && search.trim()) {
    query += ' AND (original_name LIKE ? OR summary LIKE ?)';
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ' ORDER BY created_at DESC';

  const docs = db.prepare(query).all(...params);
  return c.json({ ok: true, data: docs });
});

// POST /api/docs/upload — file upload with AI analysis
app.post('/api/docs/upload', authMiddleware, async (c) => {
  ensureUploadsDir();
  const db = getDb();
  const userId = c.get('userId');

  // Check if the request is multipart/form-data
  const contentType = c.req.header('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return c.json<ApiResponse>({ ok: false, error: 'Request must be multipart/form-data' }, 400);
  }

  try {
    const body = await c.req.parseBody();
    const file = body.file as File | undefined;

    if (!file) {
      return c.json<ApiResponse>({ ok: false, error: 'No file provided. Use field name "file".' }, 400);
    }

    const originalName = file.name || 'unnamed';
    const mimeType = file.type || '';
    const fileType = getFileType(mimeType, originalName);

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg', 'image/png', 'image/webp',
      'text/plain', 'message/rfc822',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream', // Allow fallback
    ];
    if (!allowedTypes.includes(fileType) && !fileType.startsWith('image/') && !fileType.startsWith('text/')) {
      return c.json<ApiResponse>({ ok: false, error: `Unsupported file type: ${fileType}. Accepted: PDF, JPG, PNG, WEBP, TXT, EML, DOC, DOCX` }, 400);
    }

    // Size limit: 25MB
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json<ApiResponse>({ ok: false, error: 'File too large. Maximum size is 25MB.' }, 400);
    }

    // Generate unique filename
    const ext = path.extname(originalName) || '';
    const uniqueName = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueName);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    // Analyze document with AI
    let analysis;
    try {
      analysis = await analyzeDocument(filePath, fileType, originalName);
    } catch {
      // Fallback to filename-based if AI fails
      analysis = categorizeByFilename(originalName);
    }

    const keyDetailsJson = JSON.stringify(analysis.key_details);

    // Save to database
    const result = db.prepare(
      `INSERT INTO documents (user_id, filename, original_name, category, summary, file_type, file_size, key_details, ai_processed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      userId, uniqueName, originalName, analysis.category, analysis.summary,
      fileType, file.size, keyDetailsJson, file.size > 0 ? 1 : 0
    );

    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(result.lastInsertRowid);

    return c.json({ ok: true, data: doc }, 201);
  } catch (err: any) {
    console.error('Upload error:', err);
    return c.json<ApiResponse>({ ok: false, error: `Upload failed: ${err.message || 'Unknown error'}` }, 500);
  }
});

// DELETE /api/docs/:id — delete document record and file
app.delete('/api/docs/:id', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const docId = c.req.param('id');

  const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(docId, userId) as any;
  if (!doc) {
    return c.json<ApiResponse>({ ok: false, error: 'Document not found' }, 404);
  }

  // Delete file from disk
  const filePath = path.join(UPLOADS_DIR, doc.filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Failed to delete file from disk:', err);
  }

  // Delete from database
  db.prepare('DELETE FROM documents WHERE id = ?').run(docId);

  return c.json({ ok: true, data: { message: 'Document deleted' } });
});

// PATCH /api/docs/:id — update document fields
app.patch('/api/docs/:id', authMiddleware, async (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const docId = c.req.param('id');

  const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(docId, userId) as any;
  if (!doc) {
    return c.json<ApiResponse>({ ok: false, error: 'Document not found' }, 404);
  }

  const body = await c.req.json();
  const validCategories = ['financial', 'employment', 'housing', 'legal', 'healthcare', 'identification', 'tax', 'insurance', 'education', 'correspondence', 'other'];
  const updates: string[] = [];
  const values: any[] = [];

  if (body.category !== undefined) {
    if (validCategories.includes(body.category)) {
      updates.push('category = ?');
      values.push(body.category);
    }
  }
  if (body.summary !== undefined) {
    updates.push('summary = ?');
    values.push(body.summary);
  }

  if (updates.length === 0) {
    return c.json<ApiResponse>({ ok: false, error: 'No valid fields to update' }, 400);
  }

  values.push(docId);
  db.prepare(`UPDATE documents SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const updated = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId);
  return c.json({ ok: true, data: updated });
});

// ── Vault Routes ──

// GET /api/vault — list vault items with optional search/tag filters and joined doc info
app.get('/api/vault', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const search = c.req.query('search');
  const tag = c.req.query('tag');

  let query = `
    SELECT 
      vi.id, vi.user_id, vi.document_id, vi.title, vi.description, vi.tags, vi.created_at,
      d.filename, d.file_type, d.category, d.original_name
    FROM vault_items vi
    LEFT JOIN documents d ON vi.document_id = d.id AND d.user_id = ?
    WHERE vi.user_id = ?
  `;
  const params: any[] = [userId, userId];

  if (search && search.trim()) {
    query += ' AND (vi.title LIKE ? OR vi.description LIKE ? OR vi.tags LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  if (tag && tag.trim()) {
    query += ' AND vi.tags LIKE ?';
    params.push(`%${tag.trim()}%`);
  }

  query += ' ORDER BY vi.created_at DESC';

  const items = db.prepare(query).all(...params);
  return c.json({ ok: true, data: items });
});

// POST /api/vault — create vault item, optionally linking an existing document
app.post('/api/vault', authMiddleware, async (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const body = await c.req.json();
  let { title, description, tags, document_id } = body;

  if (!title) {
    return c.json<ApiResponse>({ ok: false, error: 'Title is required' }, 400);
  }

  // Normalize tags: accept array or comma-separated string
  if (Array.isArray(tags)) {
    tags = tags.map((t: string) => t.trim()).filter(Boolean).join(', ');
  } else if (typeof tags === 'string') {
    tags = tags.split(',').map((t: string) => t.trim()).filter(Boolean).join(', ');
  } else {
    tags = '';
  }

  // Validate document_id belongs to user if provided
  if (document_id) {
    const doc = db.prepare('SELECT id FROM documents WHERE id = ? AND user_id = ?').get(document_id, userId);
    if (!doc) {
      return c.json<ApiResponse>({ ok: false, error: 'Document not found' }, 404);
    }
  }

  const result = db.prepare(
    'INSERT INTO vault_items (user_id, title, description, tags, document_id) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, title, description || '', tags, document_id || null);

  const item = db.prepare(`
    SELECT vi.*, d.filename, d.file_type, d.category, d.original_name
    FROM vault_items vi
    LEFT JOIN documents d ON vi.document_id = d.id
    WHERE vi.id = ?
  `).get(result.lastInsertRowid);

  return c.json({ ok: true, data: item }, 201);
});

// GET /api/vault/timeline — combined timeline of vault items + documents
app.get('/api/vault/timeline', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');

  const vaultItems = db.prepare(`
    SELECT 
      vi.id, vi.title, vi.description, vi.tags, vi.created_at,
      'vault_item' AS type,
      d.filename, d.file_type, d.category, d.original_name
    FROM vault_items vi
    LEFT JOIN documents d ON vi.document_id = d.id
    WHERE vi.user_id = ?
  `).all(userId);

  const documents = db.prepare(`
    SELECT 
      id, original_name AS title, summary AS description, category AS tags, created_at,
      'document' AS type,
      filename, file_type, category, original_name
    FROM documents
    WHERE user_id = ?
  `).all(userId);

  const timeline = [...(vaultItems as any[]), ...(documents as any[])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return c.json({ ok: true, data: timeline });
});

// PATCH /api/vault/:id — update a vault item
app.patch('/api/vault/:id', authMiddleware, async (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const vaultId = c.req.param('id');

  const existing = db.prepare('SELECT * FROM vault_items WHERE id = ? AND user_id = ?').get(vaultId, userId);
  if (!existing) {
    return c.json<ApiResponse>({ ok: false, error: 'Vault item not found' }, 404);
  }

  const body = await c.req.json();
  const updates: string[] = [];
  const values: any[] = [];

  if (body.title !== undefined) {
    updates.push('title = ?');
    values.push(body.title);
  }
  if (body.description !== undefined) {
    updates.push('description = ?');
    values.push(body.description);
  }
  if (body.tags !== undefined) {
    let tags = body.tags;
    if (Array.isArray(tags)) tags = tags.map((t: string) => t.trim()).filter(Boolean).join(', ');
    else if (typeof tags === 'string') tags = tags.split(',').map((t: string) => t.trim()).filter(Boolean).join(', ');
    updates.push('tags = ?');
    values.push(tags);
  }
  if (body.document_id !== undefined) {
    if (body.document_id !== null) {
      const doc = db.prepare('SELECT id FROM documents WHERE id = ? AND user_id = ?').get(body.document_id, userId);
      if (!doc) {
        return c.json<ApiResponse>({ ok: false, error: 'Document not found' }, 404);
      }
    }
    updates.push('document_id = ?');
    values.push(body.document_id);
  }

  if (updates.length === 0) {
    return c.json<ApiResponse>({ ok: false, error: 'No fields to update' }, 400);
  }

  values.push(vaultId);
  db.prepare(`UPDATE vault_items SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const item = db.prepare(`
    SELECT vi.*, d.filename, d.file_type, d.category, d.original_name
    FROM vault_items vi
    LEFT JOIN documents d ON vi.document_id = d.id
    WHERE vi.id = ?
  `).get(vaultId);

  return c.json({ ok: true, data: item });
});

// DELETE /api/vault/:id — remove vault entry (does NOT delete linked document)
app.delete('/api/vault/:id', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const vaultId = c.req.param('id');

  const existing = db.prepare('SELECT * FROM vault_items WHERE id = ? AND user_id = ?').get(vaultId, userId);
  if (!existing) {
    return c.json<ApiResponse>({ ok: false, error: 'Vault item not found' }, 404);
  }

  db.prepare('DELETE FROM vault_items WHERE id = ?').run(vaultId);
  return c.json({ ok: true, data: { message: 'Vault item deleted' } });
});

// GET /api/vault/stats — aggregate stats for vault dashboard
app.get('/api/vault/stats', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');

  const totalItems = (db.prepare('SELECT COUNT(*) as count FROM vault_items WHERE user_id = ?').get(userId) as any).count;
  const totalDocuments = (db.prepare('SELECT COUNT(*) as count FROM documents WHERE user_id = ?').get(userId) as any).count;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const recentVault = (db.prepare('SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND created_at >= ?').get(userId, thirtyDaysAgo) as any).count;
  const recentDocs = (db.prepare('SELECT COUNT(*) as count FROM documents WHERE user_id = ? AND created_at >= ?').get(userId, thirtyDaysAgo) as any).count;
  const recentCount = recentVault + recentDocs;

  // Build top tags from vault_items
  const tagsRows = db.prepare("SELECT tags FROM vault_items WHERE user_id = ? AND tags != ''").all(userId) as any[];
  const tagCounts: Record<string, number> = {};
  for (const row of tagsRows) {
    const tagList = (row.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean);
    for (const tag of tagList) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  return c.json({
    ok: true,
    data: { total_items: totalItems, total_documents: totalDocuments, recent_count: recentCount, top_tags: topTags }
  });
});

// ── Kits Routes ──

// GET /api/kits — list kits with optional category filter and content inclusion
app.get('/api/kits', authMiddleware, (c) => {
  const db = getDb();
  const category = c.req.query('category');
  const includeContent = c.req.query('include_content') === 'true';

  let query: string;
  let params: any[] = [];

  if (category && category !== 'all') {
    query = 'SELECT id, title, description, category, price_cents, content, created_at FROM kits WHERE category = ? ORDER BY created_at DESC';
    params.push(category);
  } else {
    query = 'SELECT id, title, description, category, price_cents, content, created_at FROM kits ORDER BY created_at DESC';
  }

  const kits = db.prepare(query).all(...params) as any[];

  const parsed = kits.map((kit: any) => {
    let parsedContent = null;
    if (includeContent && kit.content) {
      try {
        parsedContent = JSON.parse(kit.content);
      } catch {
        parsedContent = null;
      }
    }
    // Always return basic fields; include content only when requested
    const { content, ...rest } = kit;
    return includeContent ? { ...rest, content: parsedContent } : rest;
  });

  return c.json({ ok: true, data: parsed });
});

// GET /api/kits/purchases — list kits purchased by current user
app.get('/api/kits/purchases', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');

  const rows = db.prepare(`
    SELECT k.id, k.title, k.description, k.category, k.price_cents, k.content, k.created_at, p.purchased_at
    FROM kits k
    JOIN purchases p ON p.kit_id = k.id
    WHERE p.user_id = ?
    ORDER BY p.purchased_at DESC
  `).all(userId) as any[];

  const kits = rows.map((row: any) => {
    let parsedContent = null;
    if (row.content) {
      try {
        parsedContent = JSON.parse(row.content);
      } catch {
        parsedContent = null;
      }
    }
    const { content, ...rest } = row;
    return { ...rest, content: parsedContent };
  });

  return c.json({ ok: true, data: kits });
});

// GET /api/kits/:id — single kit with parsed content
app.get('/api/kits/:id', authMiddleware, (c) => {
  const db = getDb();
  const kitId = c.req.param('id');

  const kit = db.prepare('SELECT id, title, description, category, price_cents, content, created_at FROM kits WHERE id = ?').get(kitId) as any;
  if (!kit) {
    return c.json<ApiResponse>({ ok: false, error: 'Kit not found' }, 404);
  }

  let parsedContent = null;
  if (kit.content) {
    try {
      parsedContent = JSON.parse(kit.content);
    } catch {
      parsedContent = null;
    }
  }

  // Check if the user has purchased this kit
  const userId = c.get('userId');
  const purchase = db.prepare('SELECT id, purchased_at FROM purchases WHERE user_id = ? AND kit_id = ?').get(userId, kitId) as any;

  const { content, ...rest } = kit;
  return c.json({
    ok: true,
    data: {
      ...rest,
      content: parsedContent,
      purchased: !!purchase,
      purchased_at: purchase?.purchased_at || null,
    },
  });
});

// POST /api/kits/:id/purchase — mark a kit as purchased
app.post('/api/kits/:id/purchase', authMiddleware, async (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const kitId = c.req.param('id');

  const kit = db.prepare('SELECT id, title FROM kits WHERE id = ?').get(kitId) as any;
  if (!kit) {
    return c.json<ApiResponse>({ ok: false, error: 'Kit not found' }, 404);
  }

  const existing = db.prepare('SELECT id FROM purchases WHERE user_id = ? AND kit_id = ?').get(userId, kitId);
  if (existing) {
    return c.json<ApiResponse>({ ok: false, error: 'Kit already purchased' }, 409);
  }

  const result = db.prepare('INSERT INTO purchases (user_id, kit_id) VALUES (?, ?)').run(userId, kitId);
  const purchase = db.prepare('SELECT * FROM purchases WHERE id = ?').get(result.lastInsertRowid);
  return c.json({ ok: true, data: purchase }, 201);
});

// ── Concierge Routes ──

// POST /api/concierge/book — create a new booking
app.post('/api/concierge/book', authMiddleware, async (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const body = await c.req.json();
  const { topic, description, preferred_time } = body;

  // Validate topic
  if (!topic || !topic.trim()) {
    return c.json<ApiResponse>({ ok: false, error: 'Topic is required' }, 400);
  }
  if (topic.trim().length > 200) {
    return c.json<ApiResponse>({ ok: false, error: 'Topic must be 200 characters or fewer' }, 400);
  }

  // Validate description
  if (!description || !description.trim()) {
    return c.json<ApiResponse>({ ok: false, error: 'Description is required' }, 400);
  }
  if (description.trim().length > 1000) {
    return c.json<ApiResponse>({ ok: false, error: 'Description must be 1000 characters or fewer' }, 400);
  }

  // Validate preferred_time
  if (!preferred_time || !preferred_time.trim()) {
    return c.json<ApiResponse>({ ok: false, error: 'Preferred time is required' }, 400);
  }

  const result = db.prepare(
    'INSERT INTO concierge_bookings (user_id, topic, description, preferred_time, status) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, topic.trim(), description.trim(), preferred_time.trim(), 'pending');

  const booking = db.prepare('SELECT id, user_id, topic, description, preferred_time, status, created_at FROM concierge_bookings WHERE id = ?').get(result.lastInsertRowid);
  return c.json({ ok: true, data: booking }, 201);
});

// GET /api/concierge/bookings — list all bookings for current user
app.get('/api/concierge/bookings', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');

  const bookings = db.prepare(
    'SELECT id, user_id, topic, description, preferred_time, status, created_at FROM concierge_bookings WHERE user_id = ? ORDER BY created_at DESC'
  ).all(userId);

  return c.json({ ok: true, data: bookings });
});

// GET /api/concierge/bookings/:id — single booking
app.get('/api/concierge/bookings/:id', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const bookingId = c.req.param('id');

  const booking = db.prepare(
    'SELECT id, user_id, topic, description, preferred_time, status, created_at FROM concierge_bookings WHERE id = ? AND user_id = ?'
  ).get(bookingId, userId) as any;

  if (!booking) {
    return c.json<ApiResponse>({ ok: false, error: 'Booking not found' }, 404);
  }

  return c.json({ ok: true, data: booking });
});

// PATCH /api/concierge/bookings/:id — update a pending booking
app.patch('/api/concierge/bookings/:id', authMiddleware, async (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const bookingId = c.req.param('id');

  const booking = db.prepare(
    'SELECT * FROM concierge_bookings WHERE id = ? AND user_id = ?'
  ).get(bookingId, userId) as any;

  if (!booking) {
    return c.json<ApiResponse>({ ok: false, error: 'Booking not found' }, 404);
  }

  if (booking.status !== 'pending') {
    return c.json<ApiResponse>({ ok: false, error: 'Only pending bookings can be edited' }, 400);
  }

  const body = await c.req.json();
  const updates: string[] = [];
  const values: any[] = [];

  if (body.topic !== undefined) {
    if (!body.topic || !body.topic.trim()) {
      return c.json<ApiResponse>({ ok: false, error: 'Topic cannot be empty' }, 400);
    }
    if (body.topic.trim().length > 200) {
      return c.json<ApiResponse>({ ok: false, error: 'Topic must be 200 characters or fewer' }, 400);
    }
    updates.push('topic = ?');
    values.push(body.topic.trim());
  }

  if (body.description !== undefined) {
    if (!body.description || !body.description.trim()) {
      return c.json<ApiResponse>({ ok: false, error: 'Description cannot be empty' }, 400);
    }
    if (body.description.trim().length > 1000) {
      return c.json<ApiResponse>({ ok: false, error: 'Description must be 1000 characters or fewer' }, 400);
    }
    updates.push('description = ?');
    values.push(body.description.trim());
  }

  if (body.preferred_time !== undefined) {
    if (!body.preferred_time || !body.preferred_time.trim()) {
      return c.json<ApiResponse>({ ok: false, error: 'Preferred time cannot be empty' }, 400);
    }
    updates.push('preferred_time = ?');
    values.push(body.preferred_time.trim());
  }

  if (updates.length === 0) {
    return c.json<ApiResponse>({ ok: false, error: 'No fields to update' }, 400);
  }

  values.push(bookingId);
  db.prepare(`UPDATE concierge_bookings SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const updated = db.prepare(
    'SELECT id, user_id, topic, description, preferred_time, status, created_at FROM concierge_bookings WHERE id = ?'
  ).get(bookingId);

  return c.json({ ok: true, data: updated });
});

// PATCH /api/concierge/bookings/:id/cancel — cancel a booking
app.patch('/api/concierge/bookings/:id/cancel', authMiddleware, (c) => {
  const db = getDb();
  const userId = c.get('userId');
  const bookingId = c.req.param('id');

  const booking = db.prepare(
    'SELECT * FROM concierge_bookings WHERE id = ? AND user_id = ?'
  ).get(bookingId, userId) as any;

  if (!booking) {
    return c.json<ApiResponse>({ ok: false, error: 'Booking not found' }, 404);
  }

  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    return c.json<ApiResponse>({ ok: false, error: 'Only pending or confirmed bookings can be cancelled' }, 400);
  }

  db.prepare("UPDATE concierge_bookings SET status = 'cancelled' WHERE id = ?").run(bookingId);

  const updated = db.prepare(
    'SELECT id, user_id, topic, description, preferred_time, status, created_at FROM concierge_bookings WHERE id = ?'
  ).get(bookingId);

  return c.json({ ok: true, data: updated });
});

// Static frontend is served separately via Vercel — no backend-frontend coupling

// Always use port 3000 for the public surface, regardless of env PORT
const port = 3000;

export default {
  port,
  fetch: app.fetch,
};
