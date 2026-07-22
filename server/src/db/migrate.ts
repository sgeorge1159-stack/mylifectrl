// Database migration — creates all tables for LifeCTRL
// Adapted from the production PostgreSQL schema to SQLite.
// PostgreSQL migration path: switch to UUID PKs, ENUM types, JSONB, and enable RLS.
import { Database } from 'bun:sqlite';
import path from 'path';
import { seedKits } from './seedKits';

const DB_PATH = process.env.DATABASE_URL || path.join(import.meta.dirname, '..', '..', 'lifectrl.db');

export function migrate(dbPath?: string): Database {
  const db = new Database(dbPath || DB_PATH);

  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA foreign_keys = ON');

  // ── Users & Subscription State (Stripe Synchronization Hub) ──
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      stripe_customer_id TEXT,
      stripe_subscription_status TEXT NOT NULL DEFAULT 'unpaid'
        CHECK(stripe_subscription_status IN ('unpaid','active','past_due','canceled','incomplete','incomplete_expired','trialing','paused')),
      tos_accepted_at TEXT,
      privacy_policy_accepted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migrate: add columns if they don't exist (for existing databases)
  const userCols = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  const userColNames = new Set(userCols.map(c => c.name));
  if (!userColNames.has('tos_accepted_at')) db.run('ALTER TABLE users ADD COLUMN tos_accepted_at TEXT');
  if (!userColNames.has('privacy_policy_accepted_at')) db.run('ALTER TABLE users ADD COLUMN privacy_policy_accepted_at TEXT');
  if (!userColNames.has('stripe_customer_id')) db.run('ALTER TABLE users ADD COLUMN stripe_customer_id TEXT');
  if (!userColNames.has('stripe_subscription_status')) {
    // SQLite doesn't support ADD COLUMN with DEFAULT + CHECK in ALTER TABLE,
    // so we add a plain column and rely on application logic for the default.
    db.run("ALTER TABLE users ADD COLUMN stripe_subscription_status TEXT NOT NULL DEFAULT 'unpaid'");
  }

  // ── Action Plans (Master Life Action Plans) ──
  // Maps to production action_plans table.
  // PostgreSQL: plan_id UUID PK, plan_status ENUM, raw_narrative, jurisdiction_code.
  // SQLite adaptation: INTEGER PK, status TEXT with CHECK, raw_narrative / jurisdiction_code as TEXT.
  db.run(`
    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      situation TEXT NOT NULL DEFAULT '',
      raw_narrative TEXT NOT NULL DEFAULT '',
      jurisdiction_code TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active'
        CHECK(status IN ('draft','processing','active','completed','archived')),
      disclaimer TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migrate: add production columns to existing plans table
  const planCols = db.prepare("PRAGMA table_info(plans)").all() as { name: string }[];
  const planColNames = new Set(planCols.map(c => c.name));
  if (!planColNames.has('disclaimer')) db.run("ALTER TABLE plans ADD COLUMN disclaimer TEXT NOT NULL DEFAULT ''");
  if (!planColNames.has('raw_narrative')) db.run("ALTER TABLE plans ADD COLUMN raw_narrative TEXT NOT NULL DEFAULT ''");
  if (!planColNames.has('jurisdiction_code')) db.run("ALTER TABLE plans ADD COLUMN jurisdiction_code TEXT NOT NULL DEFAULT ''");

  // ── Plan Tasks (Jurisdiction-aware, dependency-ready) ──
  // Maps to production plan_tasks table.
  // PostgreSQL: task_id UUID PK, domain_name, task_priority ENUM, sequence_order INT, metadata JSONB.
  // SQLite adaptation: INTEGER PK, priority INTEGER with CHECK, metadata as TEXT (JSON string).
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
      domain_name TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority INTEGER NOT NULL DEFAULT 0
        CHECK(priority >= 0 AND priority <= 5),
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK(status IN ('pending','in_progress','completed')),
      sequence_order INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL DEFAULT '',
      resources TEXT NOT NULL DEFAULT '',
      estimated_time TEXT NOT NULL DEFAULT '',
      metadata TEXT NOT NULL DEFAULT '{}',
      due_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migrate: add production columns to existing tasks table
  const taskCols = db.prepare("PRAGMA table_info(tasks)").all() as { name: string }[];
  const taskColNames = new Set(taskCols.map(c => c.name));
  if (!taskColNames.has('category')) db.run("ALTER TABLE tasks ADD COLUMN category TEXT NOT NULL DEFAULT ''");
  if (!taskColNames.has('resources')) db.run("ALTER TABLE tasks ADD COLUMN resources TEXT NOT NULL DEFAULT ''");
  if (!taskColNames.has('estimated_time')) db.run("ALTER TABLE tasks ADD COLUMN estimated_time TEXT NOT NULL DEFAULT ''");
  if (!taskColNames.has('domain_name')) db.run("ALTER TABLE tasks ADD COLUMN domain_name TEXT NOT NULL DEFAULT ''");
  if (!taskColNames.has('sequence_order')) db.run('ALTER TABLE tasks ADD COLUMN sequence_order INTEGER NOT NULL DEFAULT 0');
  if (!taskColNames.has('metadata')) db.run("ALTER TABLE tasks ADD COLUMN metadata TEXT NOT NULL DEFAULT '{}'");

  // ── Task Dependencies (Core Proprietary Dependency Graph) ──
  // PostgreSQL: dependency_id UUID PK, dep_type ENUM, chk_no_self_dependence constraint.
  // SQLite adaptation: INTEGER PK, dep_type TEXT with CHECK, self-dependence CHECK.
  db.run(`
    CREATE TABLE IF NOT EXISTS task_dependencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
      upstream_task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      downstream_task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      dep_type TEXT NOT NULL DEFAULT 'hard_block'
        CHECK(dep_type IN ('hard_block','recommended','parallel')),
      CONSTRAINT chk_no_self_dependence CHECK (upstream_task_id <> downstream_task_id)
    )
  `);

  // ── Documents ──
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      summary TEXT,
      file_type TEXT NOT NULL DEFAULT '',
      file_size INTEGER NOT NULL DEFAULT 0,
      key_details TEXT NOT NULL DEFAULT '[]',
      ai_processed INTEGER NOT NULL DEFAULT 0,
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

  // ── Vault Items ──
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

  // ── Life Kits ──
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

  // ── Purchases ──
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kit_id INTEGER NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
      purchased_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ── Concierge Bookings ──
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

  // ── Feedback ──
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      page TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ── Performance Indexes ──
  db.run('CREATE INDEX IF NOT EXISTS idx_plans_user ON plans(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_tasks_plan ON tasks(plan_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_dependencies_plan ON task_dependencies(plan_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_vault_user ON vault_items(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_bookings_user ON concierge_bookings(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id)');

  // ── Note: Row-Level Security (RLS) ──
  // In the production PostgreSQL schema, all tables have RLS policies that enforce
  // tenant isolation via JWT claims (request.jwt.claim.user_id). SQLite does not
  // support RLS. The application layer enforces user isolation through WHERE clauses
  // on every query. When migrating to PostgreSQL, enable RLS and apply the policies
  // defined in the production schema.

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
