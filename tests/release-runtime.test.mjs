import test from 'node:test';
import assert from 'node:assert/strict';
import { requireReleaseNodeRuntime as gate } from '../scripts/release-runtime.mjs';

test('Node 24 is eligible for the offline release qualification', () => {
  assert.deepEqual(gate('v24.1.0'), { actualMajor: 24, requiredMajor: 24, allowed: true });
  assert.equal(gate('v24.10.2').allowed, true);
});
test('Node 22 is rejected rather than being accepted with a warning', () => {
  assert.throws(() => gate('v22.16.0'), /requires Node.js 24/);
});
test('different unqualified Node major is rejected', () => {
  for (const version of ['v18.20.8', 'v20.19.0', 'v25.0.0']) {
    assert.throws(() => gate(version), /requires Node.js 24/);
  }
});
test('malformed version or required major fails closed', () => {
  assert.throws(() => gate('22.16.0'), /Invalid/);
  assert.throws(() => gate('unknown'), /Invalid/);
  assert.throws(() => gate('v24.0.0', 0), /Invalid/);
});
