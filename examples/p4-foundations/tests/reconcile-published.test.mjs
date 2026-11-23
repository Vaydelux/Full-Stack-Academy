import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcilePublishedInventory as reconcile } from '../scripts/reconcile-published.mjs';

const a = '01.01.01', b = '01.01.02', c = '02.01.01', d = '02.01.02';
const baseline = { interactiveIds: [a, b], mdxIds: [b, c],
  checkpoint: { publishedLessons: 3, authoredMdxLessons: 2 }, catalogIds: [a, b, c, d] };

test('historical overlap between interactive and MDX representations is counted once', () => {
  assert.deepEqual(reconcile(baseline), { publishedIds: [a, b, c], publishedCount: 3, mdxCount: 2 });
});
test('legitimate new publication is accepted with its updated checkpoint', () => {
  const updated = { ...baseline, mdxIds: [b, c, d],
    checkpoint: { publishedLessons: 4, authoredMdxLessons: 3 } };
  assert.equal(reconcile(updated).publishedCount, 4);
});
test('stale published-lesson snapshot is rejected', () => {
  assert.throws(() => reconcile({ ...baseline, checkpoint: {
    ...baseline.checkpoint, publishedLessons: 338 } }), /Published registry\/checkpoint/);
});
test('stale MDX snapshot is rejected even when the union count matches', () => {
  assert.throws(() => reconcile({ ...baseline, checkpoint: {
    ...baseline.checkpoint, authoredMdxLessons: 337 } }), /MDX registry\/checkpoint/);
});
test('duplicate IDs inside either source registry fail closed', () => {
  for (const field of ['interactiveIds', 'mdxIds']) {
    assert.throws(() => reconcile({ ...baseline, [field]: [a, a] }), /Duplicate/);
  }
});
test('unknown and malformed published IDs are rejected', () => {
  assert.throws(() => reconcile({ ...baseline, mdxIds: [b, '99.99.99'] }), /Unknown published/);
  assert.throws(() => reconcile({ ...baseline, interactiveIds: [a, 'admin'] }), /Invalid interactive/);
});
test('invalid catalog or malformed input fails closed', () => {
  assert.throws(() => reconcile({ ...baseline, catalogIds: [a, a] }), /Invalid canonical/);
  assert.throws(() => reconcile({ ...baseline, mdxIds: null }), /Invalid published inventory/);
  assert.throws(() => reconcile({ ...baseline, checkpoint: null }), /Invalid published inventory/);
});
