import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';

function assertClean(app) {
  assert.equal(app.server.listenerCount('error'), 0, 'stale error listener');
  assert.equal(app.server.listenerCount('listening'), 1, 'stale listening listener');
}

test('repeated start and close releases temporary listeners', async t => {
  const app = createTaskApi();
  t.after(() => app.close());
  for (let i = 0; i < 12; i++) {
    const origin = await app.start();
    assert.deepEqual(await (await fetch(origin + '/api/health')).json(), { ok: true, mode: 'ephemeral-loopback' });
    assertClean(app);
    await app.close();
    assertClean(app);
  }
});

test('occupied port rejects, releases listeners and permits retry', async t => {
  const first = createTaskApi();
  const second = createTaskApi();
  t.after(async () => { await second.close(); await first.close(); });
  await first.start();
  await assert.rejects(second.start(first.server.address().port), { code: 'EADDRINUSE' });
  assertClean(second);
  const origin = await second.start();
  assert.equal((await fetch(origin + '/api/health')).status, 200);
  assertClean(second);
});

test('invalid port and already-listening start reject without leaked listeners', async t => {
  const app = createTaskApi();
  t.after(() => app.close());
  await assert.rejects(app.start(-1), { code: 'ERR_SOCKET_BAD_PORT' });
  assertClean(app);
  const origin = await app.start();
  await assert.rejects(app.start(), { code: 'ERR_SERVER_ALREADY_LISTEN' });
  assertClean(app);
  assert.equal((await fetch(origin + '/api/health')).status, 200);
});
