import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';
import { tasksApi, TaskRequestError } from '../examples/forms-query-vertical/react-client/src/api.ts';
import { shouldRetainCreateAttempt, shouldRetryRead } from '../examples/forms-query-vertical/react-client/src/policy.ts';

const id = '00000000-0000-4000-8000-000000000001';
const otherId = '00000000-0000-4000-8000-000000000002';
const task = { id, title: 'Practice boundaries', priority: 'normal', status: 'todo', revision: 1, createdAt: '2026-11-24T12:00:00.000Z' };
const page = { items: [task], nextCursor: null };
const json = (value, status = 200) => ({ status, type: 'application/json; charset=utf-8', body: JSON.stringify(value) });
const contractError = error => error?.name === 'TaskResponseError';
async function peer(reply, run) {
  const server = createServer((req, res) => {
    req.resume();
    req.on('end', () => {
      res.writeHead(reply.status, { 'content-type': reply.type });
      res.end(reply.body);
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const original = globalThis.fetch;
  globalThis.fetch = (url, options) => original(new URL(url, base), { ...options, signal: options?.signal ?? AbortSignal.timeout(3000) });
  try { await run(); }
  finally {
    globalThis.fetch = original;
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
test('valid task and list responses remain usable', async () => {
  await peer(json(task), async () => assert.deepEqual(await tasksApi.get(id), task));
  await peer(json(page), async () => assert.deepEqual(await tasksApi.list('all'), page));
});
test('successful non-JSON media type is rejected', async () => peer({ ...json(task), type: 'text/html' }, async () => assert.rejects(tasksApi.get(id), contractError)));
test('malformed JSON is rejected as a response contract error', async () => peer({ ...json(task), body: '{' }, async () => assert.rejects(tasksApi.get(id), contractError)));
test('invalid task status and revision are rejected', async () => {
  for (const value of [{ ...task, status: 'paused' }, { ...task, revision: 0 }, { ...task, revision: 1.5 }, { ...task, revision: Number.MAX_SAFE_INTEGER + 1 }]) {
    await peer(json(value), async () => assert.rejects(tasksApi.get(id), contractError));
  }
});
test('invalid task ID, title, priority and timestamp are rejected', async () => {
  for (const value of [{ ...task, id: 'bad' }, { ...task, title: ' ' }, { ...task, priority: 'urgent' }, { ...task, createdAt: 'not-a-date' }]) {
    await peer(json(value), async () => assert.rejects(tasksApi.get(id), contractError));
  }
});
test('wrong resource identity cannot populate the requested task cache', async () => peer(json({ ...task, id: otherId }), async () => assert.rejects(tasksApi.get(id), contractError)));
test('list rejects invalid envelopes, cursor and oversized pages', async () => {
  for (const value of [null, { items: null, nextCursor: null }, { items: [], nextCursor: 42 }, { items: [], nextCursor: 'bad cursor' }, { items: [task, { ...task, id: otherId }], nextCursor: null }]) {
    await peer(json(value), async () => assert.rejects(tasksApi.list('all', null, undefined, 1), contractError));
  }
});
test('list rejects duplicate IDs and filter violations', async () => {
  await peer(json({ items: [task, task], nextCursor: null }), async () => assert.rejects(tasksApi.list('all'), contractError));
  await peer(json(page), async () => assert.rejects(tasksApi.list('done'), contractError));
});
test('list rejects a non-progressing cursor', async () => peer(json({ ...page, nextCursor: 'cursor1' }), async () => assert.rejects(tasksApi.list('all', 'cursor1'), contractError)));
test('unexpected success status is rejected instead of being cast to Task', async () => peer({ status: 204, type: 'application/json', body: '' }, async () => assert.rejects(tasksApi.get(id), contractError)));
test('delete requires HTTP 204 rather than arbitrary successful JSON', async () => peer(json(task), async () => assert.rejects(tasksApi.remove(id), contractError)));
test('malformed create response preserves ambiguous result and same-key retry', async () => peer(json({ id }, 201), async () => {
  await assert.rejects(tasksApi.create({ title: task.title, priority: task.priority }, 'attempt-0001'), error => contractError(error) && shouldRetainCreateAttempt(error) && !shouldRetryRead(0, error));
}));
test('ordinary terminal HTTP errors retain their status and retry semantics', async () => peer(json({ title: 'Conflict' }, 409), async () => {
  await assert.rejects(tasksApi.get(id), error => error instanceof TaskRequestError && error.status === 409 && !shouldRetryRead(0, error) && !shouldRetainCreateAttempt(error));
}));
test('valid 201 create and 204 delete remain supported', async () => {
  await peer(json(task, 201), async () => assert.deepEqual(await tasksApi.create({ title: task.title, priority: task.priority }, 'attempt-0001'), task));
  await peer({ status: 204, type: 'application/json', body: '' }, async () => assert.equal(await tasksApi.remove(id), null));
});

test('extra unrecognized server fields do not enter task cache values', async () => peer(json({ ...task, internal: 'not part of DTO' }), async () => assert.deepEqual(await tasksApi.get(id), task)));
test('corrupted create acknowledgement after real commit can be recovered with the same key', async () => {
  const api = createTaskApi();
  const base = await api.start();
  const original = globalThis.fetch;
  let corrupt = true;
  globalThis.fetch = async (url, options) => {
    const response = await original(new URL(url, base), options);
    if (corrupt && options?.method === 'POST') {
      corrupt = false;
      assert.equal(response.status, 201);
      await response.json();
      return new Response('{"id":null}', { status: 201, headers: { 'content-type': 'application/json' } });
    }
    return response;
  };
  try {
    const input = { title: 'Recover committed create', priority: 'normal' };
    const key = 'recovery-0001';
    await assert.rejects(tasksApi.create(input, key), error => contractError(error) && shouldRetainCreateAttempt(error));
    const replay = await tasksApi.create(input, key);
    assert.deepEqual((await tasksApi.list('all')).items, [replay]);
  } finally {
    globalThis.fetch = original;
    api.server.closeAllConnections();
    await api.close();
  }
});
