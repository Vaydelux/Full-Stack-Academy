import test from 'node:test';
import assert from 'node:assert/strict';
import { TaskRequestError } from '../examples/forms-query-vertical/react-client/src/api.ts';
import {
  taskQueryRoot, taskQueryKey, nextTaskStatus,
  shouldRetainCreateAttempt, shouldRetryRead,
} from '../examples/forms-query-vertical/react-client/src/policy.ts';

test('query root is a stable public cache namespace without private inputs', () => {
  assert.deepEqual(taskQueryRoot, ['practice-tasks']);
});

test('each status filter gets its own deterministic infinite-query cache key', () => {
  const statuses = ['all', 'todo', 'doing', 'done'];
  const keys = statuses.map(status => taskQueryKey(status));
  assert.equal(new Set(keys.map(key => JSON.stringify(key))).size, 4);
  assert.ok(keys.every(key => key[1].limit === 10 && key[1].mode === 'infinite'));
  assert.deepEqual(taskQueryKey('todo'), taskQueryKey('todo'));
});

test('invalid status cannot silently share a query cache entry', () => {
  assert.throws(() => taskQueryKey('cancelled'), /Invalid task filter/);
});

test('state machine cycles todo → doing → done → todo', () => {
  assert.equal(nextTaskStatus('todo'), 'doing');
  assert.equal(nextTaskStatus('doing'), 'done');
  assert.equal(nextTaskStatus('done'), 'todo');
});

test('unknown state cannot silently transition', () => {
  assert.throws(() => nextTaskStatus('archived'), /Invalid task status/);
});

test('network error preserves an ambiguous POST result for SAME-key retry', () => {
  assert.equal(shouldRetainCreateAttempt(new TypeError('Failed to fetch')), true);
});

test('HTTP 503 may be ambiguous and preserves create operation key', () => {
  assert.equal(shouldRetainCreateAttempt(new TaskRequestError(503, 'Service unavailable')), true);
});

test('HTTP 429 may be retried with the original operation key', () => {
  assert.equal(shouldRetainCreateAttempt(new TaskRequestError(429, 'Too many requests')), true);
});

test('terminal HTTP validation and conflict errors do not encourage ambiguous retry', () => {
  for (const status of [400, 401, 403, 404, 409, 412, 413, 415, 422, 428]) {
    assert.equal(shouldRetainCreateAttempt(new TaskRequestError(status, 'Rejected')), false);
  }
});

test('read retry uses a fixed one-attempt budget', () => {
  assert.equal(shouldRetryRead(0, new TaskRequestError(503, 'Unavailable')), true);
  assert.equal(shouldRetryRead(1, new TaskRequestError(503, 'Unavailable')), false);
  assert.equal(shouldRetryRead(10, new TypeError('Offline')), false);
});

test('read retries never retry a stale list cursor or invalid payload', () => {
  assert.equal(shouldRetryRead(0, new TaskRequestError(409, 'List changed')), false);
  assert.equal(shouldRetryRead(0, new TaskRequestError(422, 'Invalid task')), false);
});

test('malformed retry counter cannot open an unbounded retry loop', () => {
  for (const count of [-1, NaN, Infinity, 1.5]) {
    assert.equal(shouldRetryRead(count, new TypeError('Network failed')), false);
  }
});
