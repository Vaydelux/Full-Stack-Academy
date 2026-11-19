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
const KEY_PATTERN = /^[a-zA-Z0-9_-]{8,96}$/;
const jsonHeaders = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };

class HttpProblem extends Error {
  constructor(status, title) { super(title); this.status = status; }
}
function send(res, status, payload, extra = {}) {
  res.writeHead(status, { ...jsonHeaders, ...extra });
  res.end(JSON.stringify(payload));
}
function fail(res, status, title) {
  send(res, status, { type: 'about:blank', status, title });
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
  const length = req.headers['content-length'];
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) throw new HttpProblem(413, 'Request body too large');
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.byteLength;
    if (size > MAX_BODY_BYTES) throw new HttpProblem(413, 'Request body too large');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new HttpProblem(400, 'Malformed JSON'); }
}
function cursorEncode(version, offset) { return Buffer.from(`${version}:${offset}`).toString('base64url'); }
function cursorDecode(value, version) {
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(value)) throw new HttpProblem(400, 'Invalid pagination cursor');
  const decoded = Buffer.from(value, 'base64url').toString('utf8');
  const match = /^(\d+):(\d+)$/.exec(decoded);
  if (!match || cursorEncode(Number(match[1]), Number(match[2])) !== value) throw new HttpProblem(400, 'Invalid pagination cursor');
  if (Number(match[1]) !== version) throw new HttpProblem(409, 'List changed; restart pagination');
  return Number(match[2]);
}

export function createTaskApi({ host = '127.0.0.1', maxItems = MAX_ITEMS } = {}) {
  if (host !== '127.0.0.1' && host !== '::1') throw new TypeError('Loopback binding required');
  if (!Number.isInteger(maxItems) || maxItems < 1 || maxItems > MAX_ITEMS) throw new TypeError('Invalid task limit');
  const tasks = new Map();
  const idem = new Map();
  let version = 1;
  const server = createServer(async (req, res) => {
    try {
      const ownOrigin = `http://${req.headers.host ?? ''}`;
      const url = new URL(req.url ?? '/', ownOrigin);
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
      if (req.headers.origin && req.headers.origin !== ownOrigin) throw new HttpProblem(403, 'Cross-origin requests are not allowed');
      if (req.method === 'GET' && url.pathname === '/api/health') {
        send(res, 200, { ok: true, mode: 'ephemeral-loopback' }); return;
      }
      if (req.method === 'GET' && url.pathname === '/api/tasks') {
        const limit = url.searchParams.get('limit') ?? '10';
        if (!/^(?:[1-9]|1\d|2[0-5])$/.test(limit)) throw new HttpProblem(400, 'Invalid limit');
        const cursor = url.searchParams.get('cursor');
        const offset = cursor === null ? 0 : cursorDecode(cursor, version);
        const values = [...tasks.values()].reverse();
        if (offset > values.length) throw new HttpProblem(400, 'Invalid pagination cursor');
        const page = values.slice(offset, offset + Number(limit));
        const next = offset + page.length;
        send(res, 200, { items: page, nextCursor: next < values.length ? cursorEncode(version, next) : null }); return;
      }
      if (req.method === 'POST' && url.pathname === '/api/tasks') {
        const key = req.headers['idempotency-key'];
        if (typeof key !== 'string' || !KEY_PATTERN.test(key)) throw new HttpProblem(400, 'Valid Idempotency-Key required');
        const data = validateTask(await readJson(req));
        const digest = createHash('sha256').update(JSON.stringify(data)).digest('hex');
        const old = idem.get(key);
        if (old) {
          if (old.digest !== digest) throw new HttpProblem(409, 'Idempotency key reused for a different request');
          send(res, 201, old.task, { 'idempotency-replayed': 'true' }); return;
        }
        if (tasks.size >= maxItems) throw new HttpProblem(409, 'Demo task capacity reached');
        const task = { id: randomUUID(), ...data, createdAt: new Date().toISOString() };
        tasks.set(task.id, task);
        idem.set(key, { digest, task });
        if (idem.size > 200) idem.delete(idem.keys().next().value);
        version++;
        send(res, 201, task, { 'idempotency-replayed': 'false', location: `/api/tasks/${task.id}` }); return;
      }
      const match = /^\/api\/tasks\/([0-9a-f-]{36})$/.exec(url.pathname);
      if (req.method === 'DELETE' && match) {
        if (!tasks.delete(match[1])) throw new HttpProblem(404, 'Task not found');
        version++;
        res.writeHead(204, { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
        res.end(); return;
      }
      fail(res, 404, 'Not found');
    } catch (err) {
      const status = err instanceof HttpProblem ? err.status : 500;
      fail(res, status, err instanceof HttpProblem ? err.message : 'Internal server error');
    }
  });
  return {
    server,
    async start(port = 0) {
      await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); });
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
