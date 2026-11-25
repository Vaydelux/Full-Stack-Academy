import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyRedGreen, missingTasksExport } from '../scripts/red-green.mjs';
const load = async (_slug, variant) => ({ variant });
const probe = async mod => assert.equal(mod.variant, 'solution');

test('intended failed assertion is accepted only after solution passes', async () => {
  const order = [];
  await verifyRedGreen(load, 'demo', async mod => { order.push(mod.variant); await probe(mod); });
  assert.deepEqual(order, ['solution', 'starter']);
});
test('an unexpectedly passing starter fails the lab', async () => {
  await assert.rejects(verifyRedGreen(load, 'demo', async () => {}), /Missing expected rejection/);
});
test('an instructor failure is never accepted as the starter failure', async () => {
  await assert.rejects(verifyRedGreen(load, 'demo', async () => assert.fail('instructor broken')), /instructor broken/);
});
test('missing starter module is not an acceptable negative test', async () => {
  await assert.rejects(verifyRedGreen(async (slug, variant) => {
    if (variant === 'starter') throw Object.assign(Error('missing module'), { code: 'ERR_MODULE_NOT_FOUND' });
    return load(slug, variant);
  }, 'demo', probe), { code: 'ERR_MODULE_NOT_FOUND' });
});
test('unexpected TypeError in starter fails the harness', async () => {
  await assert.rejects(verifyRedGreen(load, 'demo', async mod => {
    if (mod.variant === 'starter') throw new TypeError('unexpected missing method');
  }), /Starter must fail its intended behavioral contract/);
});
test('transport errors are not semantic assertion failures', async () => {
  await assert.rejects(verifyRedGreen(load, 'demo', async mod => {
    if (mod.variant === 'starter') throw Object.assign(Error('port occupied'), { code: 'EADDRINUSE' });
  }), /Starter must fail its intended behavioral contract/);
});
class UnknownDependenciesException extends Error {}
test('explicit expected DI exception accepts only the intended missing export', async () => {
  await verifyRedGreen(load, 'cross-module-boundaries', async mod => {
    if (mod.variant === 'starter') throw new UnknownDependenciesException('ReportsService cannot resolve TasksService');
  }, missingTasksExport);
  assert.equal(missingTasksExport(new UnknownDependenciesException('OtherService cannot resolve TasksService')), false);
  assert.equal(missingTasksExport(new Error('ReportsService cannot resolve TasksService')), false);
});
