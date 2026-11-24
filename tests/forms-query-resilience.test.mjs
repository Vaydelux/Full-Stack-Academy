import test from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';

const payload = title => ({ title, priority: 'normal' });
const key = n => 'resilience-' + String(n).padStart(8, '0');
async function fixture(run, options = {}) {
  const app = createTaskApi(options);
  const base = await app.start();
  const raw = (path, init = {}) => fetch(base + path, { ...init, signal: AbortSignal.timeout(5000) });
  const create = (n, title = 'Task ' + n) => raw('/api/tasks', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': key(n) }, body: JSON.stringify(payload(title)) });
  const list = async (query = '') => (await raw('/api/tasks' + query)).json();
  const remove = id => raw('/api/tasks/' + id, { method: 'DELETE' });
  const patch = (id, status, revision = 1) => raw('/api/tasks/' + id, { method: 'PATCH', headers: { 'content-type': 'application/json', 'if-match': '"' + revision + '"' }, body: JSON.stringify({ status }) });
  try { await run({ base, raw, create, list, remove, patch }); }
  finally { app.server.closeAllConnections(); await app.close(); }
}
async function json(response, status) { assert.equal(response.status, status); return response.json(); }
function chunked(base, chunks) {
  return new Promise((resolve, reject) => {
    const req = request(base + '/api/tasks', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': key(99), 'transfer-encoding': 'chunked' } }, res => {
      const parts = []; res.on('data', c => parts.push(c)); res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(parts).toString() })); res.on('error', reject);
    });
    req.setTimeout(5000, () => req.destroy(Error('request timeout'))); req.on('error', reject);
    for (const c of chunks) req.write(c); req.end();
  });
}

test('ledger bounds reject invalid configuration', () => { for (const n of [0, -1, 201, 1.5, NaN]) assert.throws(() => createTaskApi({ maxIdempotencyKeys: n }), /idempotency limit/); });
test('same-key replay retains original Location and response after update', async () => fixture(async ({ create, patch }) => {
  const first = await create(1); const original = await json(first, 201);
  await json(await patch(original.id, 'done'), 200);
  const replay = await create(1); assert.equal(replay.headers.get('location'), first.headers.get('location')); assert.equal(replay.headers.get('idempotency-replayed'), 'true'); assert.deepEqual(await json(replay, 201), original);
}));
test('deletion does not remove historical replay receipt or resurrect row', async () => fixture(async ({ create, remove, list, raw }) => {
  const original = await json(await create(1), 201); assert.equal((await remove(original.id)).status, 204);
  assert.deepEqual(await json(await create(1), 201), original); assert.equal((await raw('/api/tasks/' + original.id)).status, 404); assert.deepEqual((await list()).items, []);
}));
test('full ledger refuses new key without evicting old receipts', async () => fixture(async ({ create, remove, list }) => {
  const first = await json(await create(1), 201); await remove(first.id); const second = await json(await create(2), 201); await remove(second.id);
  assert.match((await json(await create(3), 409)).title, /idempotency capacity/); assert.deepEqual(await json(await create(1), 201), first); assert.deepEqual((await list()).items, []);
}, { maxIdempotencyKeys: 2 }));
test('default 200-key ceiling preserves the first deleted receipt', async () => fixture(async ({ create, remove, list }) => {
  let first; for (let n = 1; n <= 200; n++) { const task = await json(await create(n), 201); first ??= task; assert.equal((await remove(task.id)).status, 204); }
  assert.equal((await create(201)).status, 409); assert.deepEqual(await json(await create(1), 201), first); assert.equal((await list()).items.length, 0);
}));
test('full ledger still rejects changed payload under an old key', async () => fixture(async ({ create }) => { await json(await create(1), 201); assert.match((await json(await create(1, 'Changed title'), 409)).title, /different request/); }, { maxIdempotencyKeys: 1 }));
test('invalid create does not consume a key', async () => fixture(async ({ create }) => { await json(await create(1, 'x'), 422); await json(await create(1, 'Correct title'), 201); }, { maxIdempotencyKeys: 1 }));
test('task capacity denial does not consume a key', async () => fixture(async ({ create, remove }) => { const first = await json(await create(1), 201); await json(await create(2), 409); await remove(first.id); await json(await create(2), 201); }, { maxItems: 1, maxIdempotencyKeys: 2 }));
test('parallel same-key create returns one entity', async () => fixture(async ({ create, list }) => { const results = await Promise.all(Array.from({length: 8}, () => create(1))); assert.equal(results.filter(r => r.headers.get('idempotency-replayed') === 'false').length, 1); const tasks = await Promise.all(results.map(r => json(r, 201))); assert.equal(new Set(tasks.map(t => t.id)).size, 1); assert.equal((await list()).items.length, 1); }));
test('parallel different payload under same key yields one conflict', async () => fixture(async ({ create, list }) => { const results = await Promise.all([create(1, 'First payload'), create(1, 'Second payload')]); assert.deepEqual(results.map(r => r.status).sort(), [201, 409]); assert.equal((await list()).items.length, 1); }));
test('parallel creates cannot exceed remaining ledger capacity', async () => fixture(async ({ create, list }) => { const results = await Promise.all([create(1), create(2), create(3)]); assert.deepEqual(results.map(r => r.status).sort(), [201, 409, 409]); assert.equal((await list()).items.length, 1); }, { maxIdempotencyKeys: 1 }));
test('parallel revision updates admit exactly one writer', async () => fixture(async ({ create, patch, raw }) => { const task = await json(await create(1), 201); const results = await Promise.all([patch(task.id, 'doing'), patch(task.id, 'done')]); assert.deepEqual(results.map(r => r.status).sort(), [200, 412]); assert.equal((await json(await raw('/api/tasks/' + task.id), 200)).revision, 2); }));
test('failed write and replay do not invalidate existing pagination cursor', async () => fixture(async ({ create, list, raw }) => { await json(await create(1), 201); await json(await create(2), 201); const { nextCursor } = await list('?limit=1'); assert.ok(nextCursor); await json(await create(1), 201); await json(await create(3), 409); assert.equal((await raw('/api/tasks?limit=1&cursor=' + nextCursor)).status, 200); }, { maxIdempotencyKeys: 2 }));
test('successful new write invalidates old pagination cursor', async () => fixture(async ({ create, list, raw }) => { await json(await create(1), 201); await json(await create(2), 201); const { nextCursor } = await list('?limit=1'); await json(await create(3), 201); assert.equal((await raw('/api/tasks?limit=1&cursor=' + nextCursor)).status, 409); }));
test('unsafe numeric cursor is a malformed request, not a stale cursor', async () => fixture(async ({ raw }) => { const cursor = Buffer.from('9007199254740992:all:0').toString('base64url'); assert.equal((await raw('/api/tasks?cursor=' + cursor)).status, 400); }));
test('invalid UTF-8 JSON is rejected without side effects', async () => fixture(async ({ raw, list }) => { const body = Buffer.concat([Buffer.from('{"title":"valid '), Buffer.from([0xc3, 0x28]), Buffer.from('","priority":"normal"}')]); await json(await raw('/api/tasks', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': key(1) }, body }), 400); assert.equal((await list()).items.length, 0); }));
test('non-ASCII valid UTF-8 remains accepted', async () => fixture(async ({ create }) => { assert.equal((await json(await create(1, 'Kumusta mundo ñ'), 201)).title, 'Kumusta mundo ñ'); }));
test('unsupported content encoding gets 415 with no write', async () => fixture(async ({ raw, list }) => { const r = await raw('/api/tasks', { method: 'POST', headers: { 'content-type': 'application/json', 'content-encoding': 'gzip', 'idempotency-key': key(1) }, body: JSON.stringify(payload('Not compressed')) }); await json(r, 415); assert.equal((await list()).items.length, 0); }));
test('oversized chunked body gets actual 413 instead of reset', async () => fixture(async ({ base, list }) => { const result = await chunked(base, [Buffer.alloc(4096, 97), Buffer.alloc(4097, 97)]); assert.equal(result.status, 413); assert.equal(result.headers.connection, 'close'); assert.equal(JSON.parse(result.body).status, 413); assert.equal((await list()).items.length, 0); }));
test('valid chunked JSON succeeds', async () => fixture(async ({ base, list }) => { const result = await chunked(base, ['{"title":"Chunked ', 'task","priority":"normal"}']); assert.equal(result.status, 201); assert.equal((await list()).items.length, 1); }));
