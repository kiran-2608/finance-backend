// import Database from 'better-sqlite3';
// import path from 'path';
// import fs from 'fs';

// const DB_DIR = path.join(__dirname, '../../data');
// const DB_PATH = path.join(DB_DIR, 'finance.db');

// // Ensure the data directory exists
// if (!fs.existsSync(DB_DIR)) {
//   fs.mkdirSync(DB_DIR, { recursive: true });
// }

// const db = new Database(DB_PATH);

// // Enable WAL mode for better performance
// db.pragma('journal_mode = WAL');
// db.pragma('foreign_keys = ON');

// // ─── Schema ─────────────────────────────────────────────────────────────────

// db.exec(`
//   CREATE TABLE IF NOT EXISTS users (
//     id          INTEGER PRIMARY KEY AUTOINCREMENT,
//     name        TEXT    NOT NULL,
//     email       TEXT    NOT NULL UNIQUE,
//     password_hash TEXT  NOT NULL,
//     role        TEXT    NOT NULL CHECK(role IN ('viewer', 'analyst', 'admin')),
//     status      TEXT    NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
//     created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
//   );

//   CREATE TABLE IF NOT EXISTS financial_records (
//     id          INTEGER PRIMARY KEY AUTOINCREMENT,
//     amount      REAL    NOT NULL CHECK(amount > 0),
//     type        TEXT    NOT NULL CHECK(type IN ('income', 'expense')),
//     category    TEXT    NOT NULL,
//     date        TEXT    NOT NULL,
//     notes       TEXT,
//     created_by  INTEGER NOT NULL REFERENCES users(id),
//     created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
//     updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
//   );

//   CREATE INDEX IF NOT EXISTS idx_records_date     ON financial_records(date);
//   CREATE INDEX IF NOT EXISTS idx_records_type     ON financial_records(type);
//   CREATE INDEX IF NOT EXISTS idx_records_category ON financial_records(category);
//   CREATE INDEX IF NOT EXISTS idx_records_created_by ON financial_records(created_by);
// `);

// export default db;


import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'finance.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db: DatabaseType = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password_hash TEXT  NOT NULL,
    role        TEXT    NOT NULL CHECK(role IN ('viewer', 'analyst', 'admin')),
    status      TEXT    NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS financial_records (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    amount      REAL    NOT NULL CHECK(amount > 0),
    type        TEXT    NOT NULL CHECK(type IN ('income', 'expense')),
    category    TEXT    NOT NULL,
    date        TEXT    NOT NULL,
    notes       TEXT,
    created_by  INTEGER NOT NULL REFERENCES users(id),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_records_date     ON financial_records(date);
  CREATE INDEX IF NOT EXISTS idx_records_type     ON financial_records(type);
  CREATE INDEX IF NOT EXISTS idx_records_category ON financial_records(category);
  CREATE INDEX IF NOT EXISTS idx_records_created_by ON financial_records(created_by);
`);

export default db;