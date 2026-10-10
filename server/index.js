import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { existsSync } from 'node:fs';
import { db } from './db.js';
import { verifyPassword, newToken, hashToken } from './auth.js';

const PORT = Number(process.env.PORT) || 3001;
const COOKIE = 'cv_session';
const SESSION_DAYS = 30;

const app = new Hono();
const api = new Hono();

/* ---------- session middleware ---------- */

api.use('*', async (c, next) => {
  const token = getCookie(c, COOKIE);
  let user = null;
  if (token) {
    user = db.prepare(`
      SELECT u.id, u.email, u.name, u.role FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > ?
    `).get(hashToken(token), Date.now()) ?? null;
  }
  c.set('user', user);
  await next();
});

// Only the collection's owner can vote.
const requireOwner = async (c, next) => {
  if (c.get('user')?.role !== 'admin') return c.json({ error: 'Solo il proprietario può farlo.' }, 403);
  await next();
};

function startSession(c, userId) {
  const token = newToken();
  const expires = Date.now() + SESSION_DAYS * 86400_000;
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .run(hashToken(token), userId, expires);
  setCookie(c, COOKIE, token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 86400,
  });
}

// Naive in-memory throttle on auth endpoints: 10 attempts / 10 min per IP+email.
const attempts = new Map();
function throttled(key) {
  const now = Date.now();
  const list = (attempts.get(key) ?? []).filter((t) => now - t < 600_000);
  list.push(now);
  attempts.set(key, list);
  return list.length > 10;
}
const clientKey = (c, email) =>
  `${c.req.header('x-forwarded-for') ?? c.env?.incoming?.socket?.remoteAddress ?? ''}|${email}`;

/* ---------- auth ---------- */

api.post('/auth/login', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  if (throttled(clientKey(c, email))) return c.json({ error: 'Troppi tentativi, riprova tra qualche minuto.' }, 429);

  const row = db.prepare('SELECT id, email, name, role, password_hash FROM users WHERE email = ?').get(email);
  if (!row || !verifyPassword(password, row.password_hash)) {
    return c.json({ error: 'Email o password errati.' }, 401);
  }
  startSession(c, row.id);
  return c.json({ user: { id: row.id, email: row.email, name: row.name, role: row.role } });
});

api.post('/auth/logout', (c) => {
  const token = getCookie(c, COOKIE);
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
  deleteCookie(c, COOKIE, { path: '/' });
  return c.json({ ok: true });
});

api.get('/auth/me', (c) => c.json({ user: c.get('user') }));

/* ---------- cans ---------- */

const CAN_SELECT = `
  SELECT c.id, c.name, c.img, c.year, c.limited, c.country, c.size, c.category,
         c.acquired_date AS acquiredDate, v.score, v.updated_at AS votedAt
  FROM cans c
  LEFT JOIN votes v ON v.can_id = c.id AND v.user_id = (SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1)
`;
const shape = (r) => r && { ...r, limited: !!r.limited };

api.get('/cans', (c) => {
  return c.json(db.prepare(`${CAN_SELECT} ORDER BY c.id`).all().map(shape));
});

api.get('/cans/:id', (c) => {
  const id = Number(c.req.param('id'));
  const can = shape(db.prepare(`${CAN_SELECT} WHERE c.id = ?`).get(id));
  if (!can) return c.json({ error: 'Lattina non trovata.' }, 404);

  const prev = db.prepare('SELECT id, name FROM cans WHERE id < ? ORDER BY id DESC LIMIT 1').get(id)
    ?? db.prepare('SELECT id, name FROM cans ORDER BY id DESC LIMIT 1').get();
  const next = db.prepare('SELECT id, name FROM cans WHERE id > ? ORDER BY id LIMIT 1').get(id)
    ?? db.prepare('SELECT id, name FROM cans ORDER BY id LIMIT 1').get();
  const related = db.prepare(`${CAN_SELECT} WHERE c.category = ? AND c.id != ? ORDER BY RANDOM() LIMIT 4`)
    .all(can.category, id).map(shape);

  return c.json({ ...can, prev, next, related });
});

api.put('/cans/:id/vote', requireOwner, async (c) => {
  const id = Number(c.req.param('id'));
  const { score } = await c.req.json().catch(() => ({}));
  if (!Number.isInteger(score) || score < 1 || score > 10) return c.json({ error: 'Il voto va da 1 a 10.' }, 400);
  if (!db.prepare('SELECT 1 FROM cans WHERE id = ?').get(id)) return c.json({ error: 'Lattina non trovata.' }, 404);

  db.prepare(`
    INSERT INTO votes (user_id, can_id, score) VALUES (?, ?, ?)
    ON CONFLICT (user_id, can_id) DO UPDATE SET score = excluded.score, updated_at = datetime('now')
  `).run(c.get('user').id, id, score);
  return c.json({ score });
});

api.delete('/cans/:id/vote', requireOwner, (c) => {
  db.prepare('DELETE FROM votes WHERE user_id = ? AND can_id = ?').run(c.get('user').id, Number(c.req.param('id')));
  return c.json({ score: null });
});

app.route('/api', api);

/* ---------- production: serve the built SPA ---------- */

// Hashed build files never change; images may be replaced under the same name, the page itself always revalidates.
function cacheFor(path, c) {
  if (path.includes('/assets/')) c.header('Cache-Control', 'public, max-age=31536000, immutable');
  else if (path.endsWith('.html')) c.header('Cache-Control', 'no-cache');
  else c.header('Cache-Control', 'public, max-age=604800');
}

if (existsSync('dist')) {
  app.use('/*', serveStatic({ root: './dist', onFound: cacheFor }));
  app.get('*', serveStatic({ path: './dist/index.html', onFound: cacheFor }));
}

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`[api] in ascolto su http://localhost:${PORT}`);
});
