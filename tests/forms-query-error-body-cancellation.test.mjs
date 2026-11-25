import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { tasksApi, TaskRequestError } from '../examples/forms-query-vertical/react-client/src/api.ts';
import { shouldRetryRead } from '../examples/forms-query-vertical/react-client/src/policy.ts';

async function withPeer(status, run, { incomplete = true } = {}) {
  const server = createServer((req, res) => {
    res.writeHead(status, { 'content-type': 'application/problem+json' });
    if (incomplete) res.write('{');
    else res.end('{');
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const original = globalThis.fetch;
  try { await run(original, base); }
  finally {
    globalThis.fetch = original;
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}

test('cancelling after HTTP 503 headers does not become a retryable status error', async () => withPeer(503, async (fetch, base) => {
  const controller = new AbortController();
  globalThis.fetch = async (url, options) => {
    const response = await fetch(new URL(url, base), options);
    assert.equal(response.status, 503);
    controller.abort();
    return response;
  };
  await assert.rejects(tasksApi.list('all', null, controller.signal), error => error.name === 'AbortError' && !shouldRetryRead(0, error));
}));

test('error-body cancellation preserves the explicit signal reason', async () => withPeer(429, async (fetch, base) => {
  const controller = new AbortController();
  const reason = new DOMException('Stop reading', 'AbortError');
  globalThis.fetch = async (url, options) => {
    const response = await fetch(new URL(url, base), options);
    controller.abort(reason);
    return response;
  };
  await assert.rejects(tasksApi.list('all', null, controller.signal), error => error === reason);
}));

test('malformed error JSON without cancellation retains known HTTP status', async () => withPeer(409, async (fetch, base) => {
  globalThis.fetch = (url, options) => fetch(new URL(url, base), options);
  await assert.rejects(tasksApi.list('all'), error => error instanceof TaskRequestError && error.status === 409 && error.message === 'HTTP 409' && !shouldRetryRead(0, error));
}, { incomplete: false }));
