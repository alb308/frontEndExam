import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashPassword } from './auth.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// DATA_DIR lets the host point the database at a persistent disk.
const dataDir = process.env.DATA_DIR || join(root, 'server', 'data');
mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(join(dataDir, 'canvault.db'));

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cans (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    img TEXT NOT NULL,
    year INTEGER,
    limited INTEGER NOT NULL DEFAULT 0,
    country TEXT,
    size TEXT,
    category TEXT,
    acquired_date TEXT
  );

  CREATE TABLE IF NOT EXISTS votes (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    can_id INTEGER NOT NULL REFERENCES cans(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 10),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, can_id)
  );
`);

// Sync the collection from db.json on every start: new cans get added, existing ones (and their votes) are kept.
const seed = JSON.parse(readFileSync(join(root, 'db.json'), 'utf8'));
const insert = db.prepare(`
  INSERT OR IGNORE INTO cans (id, name, img, year, limited, country, size, category, acquired_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
let added = 0;
for (const c of seed.cans) {
  const { changes } = insert.run(Number(c.id), c.nome.trim(), c.img, c.year ?? null, c.limited ? 1 : 0,
    c.country || null, c.size || null, c.category || null, c.acquiredDate || null);
  added += Number(changes);
}
if (added) console.log(`[db] aggiunte ${added} lattine da db.json`);

// The owner account is created on first start. In production its credentials must come from the environment.
const { n } = db.prepare('SELECT COUNT(*) AS n FROM users').get();
if (n === 0) {
  const prod = process.env.NODE_ENV === 'production';
  const email = process.env.ADMIN_EMAIL || (prod ? '' : 'admin@monster.it');
  const password = process.env.ADMIN_PASSWORD || (prod ? '' : 'admin123');
  if (!email || (prod && password.length < 12)) {
    throw new Error('[db] imposta ADMIN_EMAIL e ADMIN_PASSWORD (almeno 12 caratteri) per creare il proprietario');
  }
  db.prepare('INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(email, 'Admin', hashPassword(password), 'admin');
}
