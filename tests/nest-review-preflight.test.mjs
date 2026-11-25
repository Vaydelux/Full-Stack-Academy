import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { assertVisibleIndex, validateLessonReviews } from '../scripts/nest-review-preflight.mjs';

const ids = ['11.01.01', '11.01.02'];
const review = () => ({ contrastPassed: true, lessonReviews: ids.map(lessonId => ({ lessonId, keyboard: true, zoom200: true, screenReaderPassed: true, contrastPassed: true, notes: 'Observed focus and readable labels.' })) });
test('complete review structure passes', () => validateLessonReviews(review(), ids));
test('missing module contrast or per-lesson records fail', () => {
  for (const change of [{ contrastPassed: false }, { lessonReviews: undefined }, { lessonReviews: [] }]) assert.throws(() => validateLessonReviews({ ...review(), ...change }, ids));
});
test('each lesson requires every flag, actual notes and unique canonical identity', () => {
  for (const change of [{ keyboard: false }, { zoom200: false }, { screenReaderPassed: false }, { contrastPassed: false }, { notes: 'placeholder notes' }, { notes: 'ok' }, { lessonId: ids[1] }, { lessonId: '99.99.99' }]) {
    const evidence = review(); Object.assign(evidence.lessonReviews[0], change);
    assert.throws(() => validateLessonReviews(evidence, ids));
  }
});
test('index requires normal tracked entries and tracked evidence when specified', () => {
  assertVisibleIndex('H a\0H review.json\0', 'review.json');
  for (const listing of ['', 'h a\0', 'S a\0', 's a\0', 'H a\0H a\0']) assert.throws(() => assertVisibleIndex(listing));
  assert.throws(() => assertVisibleIndex('H a\0', 'review.json'), /must be tracked/);
});
for (const flag of ['--assume-unchanged', '--skip-worktree']) test('real Git rejects hidden edit via ' + flag, () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'academy-index-'));
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    git('init', '-q'); writeFileSync(path.join(cwd, 'lesson.mdx'), 'original'); git('add', 'lesson.mdx');
    git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'fixture');
    assertVisibleIndex(git('ls-files', '-v', '-z'));
    git('update-index', flag, 'lesson.mdx'); writeFileSync(path.join(cwd, 'lesson.mdx'), 'changed');
    assert.equal(git('status', '--porcelain'), '');
    assert.throws(() => assertVisibleIndex(git('ls-files', '-v', '-z')), /Hidden/);
  } finally { rmSync(cwd, { recursive: true, force: true }); }
});
