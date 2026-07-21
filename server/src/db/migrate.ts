// Database migration — creates all tables for LIFECTRL
import { Database } from 'bun:sqlite';
import path from 'path';
import { seedKits } from './seedKits';

const DB_PATH = process.env.DATABASE_URL || path.join(import.meta.dirname, '..', '..', 'lifectrl.db');

export function migrate(dbPath?: string): Database {
  const db = new Database(dbPath || DB_PATH);

  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      situation TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','archived')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','in_progress','completed')),
      category TEXT NOT NULL DEFAULT '',
      resources TEXT NOT NULL DEFAULT '',
      estimated_time TEXT NOT NULL DEFAULT '',
      due_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migrate: add columns if they don't exist (for existing databases)
  const taskCols = db.prepare("PRAGMA table_info(tasks)").all() as { name: string }[];
  const taskColNames = new Set(taskCols.map(c => c.name));
  if (!taskColNames.has('category')) db.run('ALTER TABLE tasks ADD COLUMN category TEXT NOT NULL DEFAULT \'\'');
  if (!taskColNames.has('resources')) db.run('ALTER TABLE tasks ADD COLUMN resources TEXT NOT NULL DEFAULT \'\'');
  if (!taskColNames.has('estimated_time')) db.run('ALTER TABLE tasks ADD COLUMN estimated_time TEXT NOT NULL DEFAULT \'\'');

  // Add disclaimer column to plans
  const planCols = db.prepare("PRAGMA table_info(plans)").all() as { name: string }[];
  const planColNames = new Set(planCols.map(c => c.name));
  if (!planColNames.has('disclaimer')) db.run('ALTER TABLE plans ADD COLUMN disclaimer TEXT NOT NULL DEFAULT \'\'');

  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      summary TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS vault_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      document_id INTEGER REFERENCES documents(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      tags TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS kits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'general',
      price_cents INTEGER NOT NULL DEFAULT 0,
      content TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kit_id INTEGER NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
      purchased_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS concierge_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      topic TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      preferred_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','completed','cancelled')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migrate documents table: add columns if they don't exist
  const docCols = db.prepare("PRAGMA table_info(documents)").all() as { name: string }[];
  const docColNames = new Set(docCols.map(c => c.name));
  if (!docColNames.has('file_type')) db.run("ALTER TABLE documents ADD COLUMN file_type TEXT NOT NULL DEFAULT ''");
  if (!docColNames.has('file_size')) db.run('ALTER TABLE documents ADD COLUMN file_size INTEGER NOT NULL DEFAULT 0');
  if (!docColNames.has('key_details')) db.run("ALTER TABLE documents ADD COLUMN key_details TEXT NOT NULL DEFAULT '[]'");
  if (!docColNames.has('ai_processed')) db.run('ALTER TABLE documents ADD COLUMN ai_processed INTEGER NOT NULL DEFAULT 0');

  // Indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_plans_user ON plans(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_tasks_plan ON tasks(plan_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_vault_user ON vault_items(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_bookings_user ON concierge_bookings(user_id)');

  // Seed kits if table is empty
  seedKits(db);

  return db;
}

// Run directly: bun run src/db/migrate.ts
if (import.meta.main) {
  console.log('Running database migration...');
  const db = migrate();
  console.log('Migration complete. Tables created.');
  db.close();
}
