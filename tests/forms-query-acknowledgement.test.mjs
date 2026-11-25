import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { tasksApi, TaskResponseError, TaskRequestError } from '../examples/forms-query-vertical/react-client/src/api.ts';
import { shouldRetryRead, shouldRetainCreateAttempt } from '../examples/forms-query-vertical/react-client/src/policy.ts';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';

const id = '00000000-0000-4000-8000-000000000001';
const task = { id, title: 'Practice boundaries', priority: 'normal', status: 'todo', revision: 1, createdAt: '2026-11-24T12:00:00.000Z' };
const input = { title: task.title, priority: task.priority };
const key = 'attempt-0001';
const json = (value, status = 200) => ({ status, body: JSON.stringify(value) });
const contractError = error => error instanceof TaskResponseError && !shouldRetryRead(0, error) && shouldRetainCreateAttempt(error);
async function peer(reply, run) {
  const server = createServer((req, res) => {
    req.resume();
    req.on('end', () => {
      res.writeHead(reply.status, { 'content-type': reply.type ?? 'application/json' });
      res.end(reply.body);
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = 'http://127.0.0.1:' + server.address().port;
  const original = globalThis.fetch;
  globalThis.fetch = (url, options) => original(new URL(url, base), { ...options, signal: options?.signal ?? AbortSignal.timeout(3000) });
  try { await run(); }
  finally { globalThis.fetch = original; server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}

test('create rejects structurally valid acknowledgements for another payload or initial state', async () => {
  for (const value of [{ ...task, title: 'Different request' }, { ...task, priority: 'high' }, { ...task, status: 'done' }, { ...task, revision: 2 }]) {
    await peer(json(value, 201), async () => assert.rejects(tasksApi.create(input, key), contractError));
  }
});
test('PATCH rejects structurally valid but wrong status or revision acknowledgements', async () => {
  for (const value of [task, { ...task, status: 'doing', revision: 2 }, { ...task, status: 'done', revision: 5 }]) {
    await peer(json(value), async () => assert.rejects(tasksApi.updateStatus(id, 'done', 3), contractError));
  }
});
test('valid create normalization and both PATCH revision outcomes remain accepted', async () => {
  await peer(json(task, 201), async () => assert.deepEqual(await tasksApi.create({ ...input, title: '  ' + task.title + '  ' }, key), task));
  for (const revision of [3, 4]) {
    const value = { ...task, status: 'done', revision };
    await peer(json(value), async () => assert.deepEqual(await tasksApi.updateStatus(id, 'done', 3), value));
  }
});
test('oversized success JSON cannot enter the task cache even with valid projected fields', async () => {
  await peer(json({ ...task, extra: 'x'.repeat(70 * 1024) }), async () => assert.rejects(tasksApi.get(id), contractError));
});
test('malformed UTF-8 is rejected instead of silently creating replacement characters', async () => {
  const body = Buffer.concat([Buffer.from(JSON.stringify({ ...task, title: 'invalid PLACEHOLDER' }).split('PLACEHOLDER')[0]), Buffer.from([0xc3, 0x28]), Buffer.from(JSON.stringify({ ...task, title: 'invalid PLACEHOLDER' }).split('PLACEHOLDER')[1])]);
  await peer({ status: 200, body }, async () => assert.rejects(tasksApi.get(id), contractError));
});
test('oversized and excessively long HTTP error titles retain status without reflecting unbounded text', async () => {
  for (const title of ['x'.repeat(9000), 'x'.repeat(300)]) {
    await peer(json({ title }, 409), async () => assert.rejects(tasksApi.get(id), e => e instanceof TaskRequestError && e.status === 409 && e.message === 'HTTP 409' && !shouldRetryRead(0, e)));
  }
});
test('successful HTTP response aborted after headers preserves the caller reason', async () => {
  await peer(json(task), async () => {
    const original = globalThis.fetch, controller = new AbortController(), reason = new Error('Stop reading');
    globalThis.fetch = async (url, options) => { const response = await original(url, options); controller.abort(reason); return response; };
    try { await assert.rejects(tasksApi.get(id, controller.signal), e => e === reason); }
    finally { globalThis.fetch = original; }
  });
});
test('real server create replay after status change, no-op PATCH, and maximum page stay compatible', async () => {
  const app = createTaskApi(), base = await app.start(), original = globalThis.fetch;
  globalThis.fetch = (url, options) => original(new URL(url, base), { ...options, signal: options?.signal ?? AbortSignal.timeout(3000) });
  try {
    const first = await tasksApi.create(input, key);
    const changed = await tasksApi.updateStatus(first.id, 'doing', 1);
    assert.equal(changed.revision, 2);
    assert.deepEqual(await tasksApi.updateStatus(first.id, 'doing', 2), changed);
    assert.deepEqual(await tasksApi.create(input, key), first);
    for (let i = 0; i < 24; i++) await tasksApi.create({ title: '😀'.repeat(50), priority: 'high' }, 'batch-key-' + i);
    const page = await tasksApi.list('all', null, undefined, 25);
    assert.equal(page.items.length, 25);
    assert.equal(page.nextCursor, null);
    assert.equal(await tasksApi.remove(first.id), null);
  } finally { globalThis.fetch = original; await app.close(); }
});
