import assert from 'node:assert/strict';
import test from 'node:test';
import { auditSuite } from '../scripts/verify-runtime-test-coverage.mjs';

const expected = ['11.02.01', '11.02.02'];
const slugs = { '11.02.01': 'middleware-execution', '11.02.02': 'pipes-zod-validation' };
const good = [
  "test('11.02.01 middleware', async () => { await checkBoth('middleware-execution', async mod => {}); });",
  "test('11.02.02 validation', async () => { await checkBoth('pipes-zod-validation', async mod => {}); });",
].join('\n');

test('coverage inspector accepts uniquely mapped topic tests', () => {
  assert.deepEqual(auditSuite(good, '11.02', expected, slugs), []);
});
test('coverage inspector rejects an omitted canonical test', () => {
  assert.ok(auditSuite(good.split('\n')[0], '11.02', expected, slugs)
    .some(issue => issue.includes('11.02.02: missing')));
});
test('coverage inspector rejects duplicate topic identifiers', () => {
  const duplicated = good + "\ntest('11.02.01 repeated', () => {checkBoth('middleware-execution', () => {});});";
  assert.ok(auditSuite(duplicated, '11.02', expected, slugs)
    .some(issue => issue.includes('duplicate')));
});
test('coverage inspector detects a test accidentally mapped to another lab', () => {
  const swapped = good.replace("checkBoth('pipes-zod-validation'", "checkBoth('guards-authorization'");
  assert.ok(auditSuite(swapped, '11.02', expected, slugs)
    .some(issue => issue.includes('does not exercise canonical')));
});
test('coverage inspector rejects skipped, focused and TODO tests', () => {
  for (const modifier of ['skip', 'only', 'todo']) {
    const tampered = good + "\ntest." + modifier + "('extra', () => {});";
    assert.ok(auditSuite(tampered, '11.02', expected, slugs)
      .some(issue => issue.includes('skipped')));
  }
});
test('coverage inspector detects a test registered in the wrong module', () => {
  const misassigned = good + "\ntest('11.03.01 wrong module', () => {});";
  assert.ok(auditSuite(misassigned, '11.02', expected, slugs)
    .some(issue => issue.includes('unexpected or misassigned')));
});
