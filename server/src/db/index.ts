import { Database } from 'bun:sqlite';
import { migrate } from './migrate';

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    db = migrate();
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
