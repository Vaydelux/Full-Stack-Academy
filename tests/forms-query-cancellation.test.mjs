import test from 'node:test';
import assert from 'node:assert/strict';
import { TaskRequestError } from '../examples/forms-query-vertical/react-client/src/api.ts';
import { shouldRetryRead, shouldRetainCreateAttempt } from '../examples/forms-query-vertical/react-client/src/policy.ts';

test('read abort is intentional cancellation, not a transient retry', () => {
  const abort = AbortSignal.abort().reason;
  assert.equal(shouldRetryRead(0, abort), false);
});
test('network cancellation from another realm may have an AbortError name', () => {
  assert.equal(shouldRetryRead(0, { name: 'AbortError' }), false);
});
test('aborted create remains ambiguous and retains the original operation key', () => {
  assert.equal(shouldRetainCreateAttempt(AbortSignal.abort().reason), true);
});
test('network failure and timeout can still use the single read retry', () => {
  assert.equal(shouldRetryRead(0, new TypeError('Failed to fetch')), true);
  assert.equal(shouldRetryRead(0, new DOMException('Deadline', 'TimeoutError')), true);
  assert.equal(shouldRetryRead(1, new DOMException('Deadline', 'TimeoutError')), false);
});
test('terminal conflicts and validation errors are not retried', () => {
  for (const status of [400, 409, 412, 422]) assert.equal(shouldRetryRead(0, new TaskRequestError(status, 'Rejected')), false);
});
