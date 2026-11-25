import test from 'node:test';
import assert from 'node:assert/strict';
import { connect } from 'node:net';
import { once } from 'node:events';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';

async function bounded(promise, ms = 2000) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Fixture shutdown timed out')), ms);
    })]);
  } finally { clearTimeout(timer); }
}

test('close during startup waits for listening and then releases the port', async t => {
  const app = createTaskApi();
  t.after(() => app.close());
  for (let i = 0; i < 10; i++) {
    const start = app.start();
    const close = app.close();
    await assert.rejects(app.start(), { code: 'ERR_TASK_API_CLOSING' });
    await bounded(Promise.all([start, close, app.close()]));
    assert.equal(app.server.listening, false);
    assert.equal(app.server.listenerCount('error'), 0);
  }
  const origin = await app.start();
  assert.equal((await fetch(origin + '/api/health')).status, 200);
});

test('duplicate startup does not interfere with the first listener', async t => {
  const app = createTaskApi();
  t.after(() => app.close());
  const first = app.start();
  await assert.rejects(app.start(), { code: 'ERR_SERVER_ALREADY_LISTEN' });
  assert.equal((await fetch((await first) + '/api/health')).status, 200);
});

test('close during failed startup settles and permits a later successful start', async t => {
  const owner = createTaskApi(), app = createTaskApi();
  t.after(async () => { await app.close(); await owner.close(); });
  await owner.start();
  const start = app.start(owner.server.address().port);
  const rejected = assert.rejects(start, { code: 'EADDRINUSE' });
  await bounded(Promise.all([rejected, app.close(), app.close()]));
  assert.equal(app.server.listening, false);
  assert.equal((await fetch((await app.start()) + '/api/health')).status, 200);
});

test('real partial HTTP body cannot block shutdown or create a task after restart', async t => {
  const app = createTaskApi();
  const url = new URL(await app.start());
  const socket = connect(Number(url.port), url.hostname);
  // Always destroy the client even if an assertion fails against the old implementation.
  t.after(async () => { socket.destroy(); await app.close(); });
  await once(socket, 'connect');
  const received = once(app.server, 'request');
  socket.write('POST /api/tasks HTTP/1.1\r\nHost: ' + url.host + '\r\nContent-Type: application/json\r\nIdempotency-Key: incomplete-01\r\nContent-Length: 100\r\n\r\n{');
  await bounded(received);
  const disconnected = once(socket, 'close');
  await bounded(Promise.all([app.close(), app.close(), disconnected]));
  assert.equal(app.server.listening, false);
  const origin = await app.start();
  assert.deepEqual(await (await fetch(origin + '/api/tasks')).json(), { items: [], nextCursor: null });
});
