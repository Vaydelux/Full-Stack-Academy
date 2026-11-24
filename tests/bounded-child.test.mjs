import test from 'node:test';
import assert from 'node:assert/strict';
import { runBoundedChild } from '../scripts/bounded-child.mjs';
const run = (source, timeoutMs = 5000) => runBoundedChild(process.execPath, ['-e', source], { timeoutMs, stdio: 'ignore' });
test('successful direct child exits normally', async () => { await run('process.exit(0)'); });
test('nonzero exit is rejected', async () => { await assert.rejects(run('process.exit(7)'), /Child failed: 7/); });
test('hanging child is killed and rejected', { timeout: 5000 }, async () => {
  await assert.rejects(run('setInterval(() => {}, 1000)', 150), /Child exceeded 150ms/);
});
test('spawn error is rejected', async () => {
  await assert.rejects(runBoundedChild('academy-missing-executable-924ee', [], { timeoutMs: 1000, stdio: 'ignore' }), error => error.code === 'ENOENT');
});
test('invalid timeout is rejected before starting a child', () => {
  for (const timeoutMs of [0, -1, Infinity, 1.5, 2147483648, undefined]) {
    assert.throws(() => runBoundedChild(process.execPath, ['-e', ''], { timeoutMs }), /Invalid child timeout/);
  }
});
test('signal termination is rejected', { skip: process.platform === 'win32' }, async () => {
  await assert.rejects(run("process.kill(process.pid, 'SIGTERM')"), /Child failed: SIGTERM/);
});
