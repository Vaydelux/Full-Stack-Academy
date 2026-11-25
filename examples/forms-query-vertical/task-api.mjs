/**
 * Education-only loopback task API. Single-process memory, no user accounts.
 * NEVER bind this server to a public interface or present it as production auth.
 */
import { createServer } from 'node:http';
import { randomUUID, createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const staticRoot = new URL('./', import.meta.url);

const MAX_BODY_BYTES = 8 * 1024;
const MAX_ITEMS = 100;
const MAX_IDEMPOTENCY_KEYS = 200;
const KEY_PATTERN = /^[a-zA-Z0-9_-]{8,96}$/;
const TASK_STATES = new Set(['todo', 'doing', 'done']);
const FILTER_STATES = new Set(['all', ...TASK_STATES]);
const jsonHeaders = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };

class HttpProblem extends Error {
  constructor(status, title) { super(title); this.status = status; }
}
function send(res, status, payload, extra = {}) {
  res.writeHead(status, { ...jsonHeaders, ...extra });
  res.end(JSON.stringify(payload));
}
function fail(res, status, title) {
  send(res, status, { type: 'about:blank', status, title }, { 'content-type': 'application/problem+json; charset=utf-8' });
}
function validateTask(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpProblem(422, 'Task must be an object');
  if (Object.keys(value).some(key => key !== 'title' && key !== 'priority')) throw new HttpProblem(422, 'Unknown fields');
  if (typeof value.title !== 'string') throw new HttpProblem(422, 'Title must be text');
  const title = value.title.trim();
  if (title.length < 3 || title.length > 100) throw new HttpProblem(422, 'Title must be 3–100 characters');
  if (!['low', 'normal', 'high'].includes(value.priority)) throw new HttpProblem(422, 'Invalid priority');
  return { title, priority: value.priority };
}
async function readJson(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] ?? '')) throw new HttpProblem(415, 'Expected application/json');
  const encoding = req.headers['content-encoding'];
  if (encoding && encoding.toLowerCase() !== 'identity') throw new HttpProblem(415, 'Unsupported content encoding');
  const length = req.headers['content-length'];
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) throw new HttpProblem(413, 'Request body too large');
  const chunks = [];
  let size = 0;
  // Do not destroy the socket on early iterator exit: the handler can send a bounded 413.
  for await (const chunk of req.iterator({ destroyOnReturn: false })) {
    size += chunk.byteLength;
    if (size > MAX_BODY_BYTES) throw new HttpProblem(413, 'Request body too large');
    chunks.push(chunk);
  }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(Buffer.concat(chunks))); }
  catch { throw new HttpProblem(400, 'Malformed JSON'); }
}
function validatePatch(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== 1 || !Object.hasOwn(value, 'status') || !TASK_STATES.has(value.status)) {
    throw new HttpProblem(422, 'Only status todo, doing or done may be updated');
  }
  return value.status;
}
function cursorEncode(version, filter, offset) { return Buffer.from(`${version}:${filter}:${offset}`).toString('base64url'); }
function cursorDecode(value, version, filter) {
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(value)) throw new HttpProblem(400, 'Invalid pagination cursor');
  const decoded = Buffer.from(value, 'base64url').toString('utf8');
  const match = /^(\d+):(all|todo|doing|done):(\d+)$/.exec(decoded);
  if (!match || !Number.isSafeInteger(Number(match[1])) || !Number.isSafeInteger(Number(match[3])) || cursorEncode(Number(match[1]), match[2], Number(match[3])) !== value) throw new HttpProblem(400, 'Invalid pagination cursor');
  if (Number(match[1]) !== version) throw new HttpProblem(409, 'List changed; restart pagination');
  if (match[2] !== filter) throw new HttpProblem(400, 'Cursor belongs to another filter');
  return Number(match[3]);
}

export function createTaskApi({ host = '127.0.0.1', maxItems = MAX_ITEMS, maxIdempotencyKeys = MAX_IDEMPOTENCY_KEYS } = {}) {
  if (host !== '127.0.0.1' && host !== '::1') throw new TypeError('Loopback binding required');
  if (!Number.isInteger(maxItems) || maxItems < 1 || maxItems > MAX_ITEMS) throw new TypeError('Invalid task limit');
  if (!Number.isInteger(maxIdempotencyKeys) || maxIdempotencyKeys < 1 || maxIdempotencyKeys > MAX_IDEMPOTENCY_KEYS) throw new TypeError('Invalid idempotency limit');
  const tasks = new Map();
  const idem = new Map();
  let version = 1;
  const server = createServer(async (req, res) => {
    try {
      // Reject DNS rebinding/Host spoofing before serving even static assets.
      const bound = server.address();
      if (!bound || typeof bound === 'string') throw new HttpProblem(503, 'Listener unavailable');
      const expectedHost = host === '::1' ? `[::1]:${bound.port}` : `127.0.0.1:${bound.port}`;
      if (req.headers.host !== expectedHost) throw new HttpProblem(421, 'Invalid Host header');
      const ownOrigin = `http://${expectedHost}`;
      if (req.headers.origin && req.headers.origin !== ownOrigin) throw new HttpProblem(403, 'Cross-origin requests are not allowed');
      if (req.headers['sec-fetch-site'] === 'cross-site') throw new HttpProblem(403, 'Cross-site requests are not allowed');
      // Accept only origin-form HTTP targets; never an absolute cross-origin URI.
      if (!req.url?.startsWith('/') || req.url.startsWith('//') || req.url.includes('\\') || req.url.includes('#')) {
        throw new HttpProblem(400, 'Invalid request target');
      }
      const url = new URL(req.url, ownOrigin);
      const staticFiles = {
        '/': ['index.html', 'text/html; charset=utf-8'],
        '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
        '/browser.mjs': ['browser.mjs', 'text/javascript; charset=utf-8'],
        '/task-client.mjs': ['task-client.mjs', 'text/javascript; charset=utf-8'],
      };
      if (req.method === 'GET' && staticFiles[url.pathname]) {
        const [file, contentType] = staticFiles[url.pathname];
        const body = await readFile(new URL(file, staticRoot));
        res.writeHead(200, {
          'content-type': contentType,
          'cache-control': 'no-store',
          'x-content-type-options': 'nosniff',
          'content-security-policy': "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; form-action 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'",
          'referrer-policy': 'no-referrer',
        });
        res.end(body); return;
      }
      if (!url.pathname.startsWith('/api/')) { fail(res, 404, 'Not found'); return; }
      if (req.method === 'GET' && url.pathname === '/api/health') {
        send(res, 200, { ok: true, mode: 'ephemeral-loopback' }); return;
      }
      if (req.method === 'GET' && url.pathname === '/api/tasks') {
        if ([...url.searchParams.keys()].some(name => !['limit', 'status', 'cursor'].includes(name)) ||
            ['limit', 'status', 'cursor'].some(name => url.searchParams.getAll(name).length > 1)) {
          throw new HttpProblem(400, 'Unknown or repeated query parameter');
        }
        const filter = url.searchParams.get('status') ?? 'all';
        if (!FILTER_STATES.has(filter)) throw new HttpProblem(400, 'Invalid status filter');
        const limit = url.searchParams.get('limit') ?? '10';
        if (!/^(?:[1-9]|1\d|2[0-5])$/.test(limit)) throw new HttpProblem(400, 'Invalid limit');
        const cursor = url.searchParams.get('cursor');
        const offset = cursor === null ? 0 : cursorDecode(cursor, version, filter);
        const values = [...tasks.values()].reverse().filter(task => filter === 'all' || task.status === filter);
        if (offset > values.length) throw new HttpProblem(400, 'Invalid pagination cursor');
        const page = values.slice(offset, offset + Number(limit));
        const next = offset + page.length;
        send(res, 200, { items: page, nextCursor: next < values.length ? cursorEncode(version, filter, next) : null }); return;
      }
      if (req.method === 'POST' && url.pathname === '/api/tasks') {
        const key = req.headers['idempotency-key'];
        if (typeof key !== 'string' || !KEY_PATTERN.test(key)) throw new HttpProblem(400, 'Valid Idempotency-Key required');
        const data = validateTask(await readJson(req));
        const digest = createHash('sha256').update(JSON.stringify(data)).digest('hex');
        const old = idem.get(key);
        if (old) {
          if (old.digest !== digest) throw new HttpProblem(409, 'Idempotency key reused for a different request');
          send(res, 201, old.task, { 'idempotency-replayed': 'true', location: `/api/tasks/${old.task.id}` }); return;
        }
        // Preserve accepted operation IDs for this fixture's lifetime. Never silently evict
        // one and allow a delayed retry to recreate a deleted task.
        if (idem.size >= maxIdempotencyKeys) throw new HttpProblem(409, 'Demo idempotency capacity reached; start a fresh fixture');
        if (tasks.size >= maxItems) throw new HttpProblem(409, 'Demo task capacity reached');
        const task = { id: randomUUID(), ...data, status: 'todo', revision: 1, createdAt: new Date().toISOString() };
        tasks.set(task.id, task);
        idem.set(key, { digest, task });
        version++;
        send(res, 201, task, { 'idempotency-replayed': 'false', location: `/api/tasks/${task.id}` }); return;
      }
      const match = /^\/api\/tasks\/([0-9a-f-]{36})$/.exec(url.pathname);
      if (req.method === 'GET' && match) {
        const task = tasks.get(match[1]);
        if (!task) throw new HttpProblem(404, 'Task not found');
        send(res, 200, task, { etag: `"${task.revision}"` }); return;
      }
      if (req.method === 'PATCH' && match) {
        if (!tasks.has(match[1])) throw new HttpProblem(404, 'Task not found');
        const expected = req.headers['if-match'];
        if (typeof expected !== 'string') throw new HttpProblem(428, 'If-Match revision is required');
        const nextStatus = validatePatch(await readJson(req));
        // The body read yields. Check the *current* revision immediately before
        // the synchronous Map update or concurrent requests can both succeed.
        const current = tasks.get(match[1]);
        if (!current) throw new HttpProblem(404, 'Task not found');
        if (expected !== `"${current.revision}"`) throw new HttpProblem(412, 'Task changed; refresh before retrying');
        if (nextStatus !== current.status) {
          tasks.set(current.id, { ...current, status: nextStatus, revision: current.revision + 1 });
          version++;
        }
        const updated = tasks.get(current.id);
        send(res, 200, updated, { etag: `"${updated.revision}"` }); return;
      }
      if (req.method === 'DELETE' && match) {
        if (!tasks.delete(match[1])) throw new HttpProblem(404, 'Task not found');
        version++;
        res.writeHead(204, { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
        res.end(); return;
      }
      fail(res, 404, 'Not found');
    } catch (err) {
      if (res.destroyed || res.writableEnded) return;
      const status = err instanceof HttpProblem ? err.status : 500;
      if (status === 413 || status === 415) res.setHeader('connection', 'close');
      fail(res, status, err instanceof HttpProblem ? err.message : 'Internal server error');
    }
  });
  return {
    server,
    async start(port = 0) {
      await new Promise((resolve, reject) => {
        const cleanup = () => {
          server.off('error', onError);
          server.off('listening', onListening);
        };
        const onError = error => { cleanup(); reject(error); };
        const onListening = () => { cleanup(); resolve(); };
        server.once('error', onError);
        server.once('listening', onListening);
        try { server.listen(port, host); }
        catch (error) { onError(error); }
      });
      const address = server.address();
      return `http://${host === '::1' ? '[::1]' : host}:${address.port}`;
    },
    async close() { if (server.listening) await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve())); },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const app = createTaskApi();
  const address = await app.start(Number(process.env.PORT ?? 3337));
  console.log(`Teaching API: ${address}; local memory only, no authentication, NOT for public access`);
}
