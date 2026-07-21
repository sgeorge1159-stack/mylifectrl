import { Database } from 'bun:sqlite';
import { migrate } from './migrate';
import path from 'path';

let db: Database | null = null;

// Use DATABASE_URL env var for production (e.g., /data/lifectrl.db on Fly.io).
// Fall back to the local server directory for development.
const DB_PATH = process.env.DATABASE_URL || path.join(import.meta.dirname, '..', '..', 'lifectrl.db');

export function getDb(): Database {
  if (!db) {
    db = migrate(DB_PATH);
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
