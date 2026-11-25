import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { tasksApi, TaskRequestError } from '../examples/forms-query-vertical/react-client/src/api.ts';
import { shouldRetryRead, shouldRetainCreateAttempt } from '../examples/forms-query-vertical/react-client/src/policy.ts';

async function peer(handler, run) {
  const server = createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = 'http://127.0.0.1:' + server.address().port;
  const original = globalThis.fetch;
  // A test-only watchdog bounds the negative case on the old implementation.
  globalThis.fetch = (url, options) => original(new URL(url, base), { ...options, signal: AbortSignal.any([...(options?.signal ? [options.signal] : []), AbortSignal.timeout(7000)]) });
  try { await run(); }
  finally { globalThis.fetch = original; server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}
const timeout = error => error.name === 'TimeoutError' && shouldRetryRead(0, error) && !shouldRetryRead(1, error) && shouldRetainCreateAttempt(error);

test('one deadline bounds stalled headers, success bodies and optional error bodies', { timeout: 10000 }, async () => peer((req, res) => {
  if (req.url.includes('status=todo')) return;
  res.writeHead(req.url.includes('status=done') ? 409 : 200, { 'content-type': 'application/json' });
  res.write('{');
}, async () => {
  const started = performance.now();
  await Promise.all([
    assert.rejects(tasksApi.list('todo'), timeout),
    assert.rejects(tasksApi.list('doing'), timeout),
    assert.rejects(tasksApi.list('done'), e => e instanceof TaskRequestError && e.status === 409 && !shouldRetryRead(0, e)),
  ]);
  assert.ok(performance.now() - started < 6500, 'Client relied on external watchdog instead of its own deadline');
}));
test('custom caller cancellation is not a retryable transport error', async () => peer((_req, res) => { res.writeHead(200, { 'content-type': 'application/json' }); res.write('{'); }, async () => {
  const original = globalThis.fetch;
  for (const reason of [new Error('User cancelled'), 'navigation changed']) {
    const controller = new AbortController();
    globalThis.fetch = async (url, options) => { const response = await original(url, options); controller.abort(reason); return response; };
    await assert.rejects(tasksApi.list('all', null, controller.signal), e => e.name === 'AbortError' && e.cause === reason && !shouldRetryRead(0, e));
  }
  globalThis.fetch = original;
}));
test('pre-aborted caller is rejected before fetch, preserving custom cancellation cause', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = () => { calls++; throw Error('Unexpected fetch'); };
  try {
    const reason = new Error('Already cancelled');
    await assert.rejects(tasksApi.list('all', null, AbortSignal.abort(reason)), e => e.name === 'AbortError' && e.cause === reason && !shouldRetryRead(0, e));
    assert.equal(calls, 0);
  } finally { globalThis.fetch = original; }
});
