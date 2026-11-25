import assert from 'node:assert/strict';

/** Reject index flags that can hide changed tracked files from git status. */
export function assertVisibleIndex(listing, requiredPath) {
  const rows = listing.split('\0').filter(Boolean);
  assert.ok(rows.length, 'Empty Git index');
  const paths = new Set();
  for (const row of rows) {
    assert.ok(row.startsWith('H '), 'Hidden or unsupported Git index flag: ' + row);
    const file = row.slice(2);
    assert.ok(file && !paths.has(file), 'Invalid or duplicate Git index path');
    paths.add(file);
  }
  if (requiredPath) assert.ok(paths.has(requiredPath), 'Review evidence must be tracked: ' + requiredPath);
}

/** Structural evidence check, not proof that a human actually conducted the review. */
export function validateLessonReviews(evidence, lessonIds) {
  assert.equal(evidence.contrastPassed, true, 'Missing module contrast review');
  assert.ok(Array.isArray(evidence.lessonReviews), 'Missing per-lesson accessibility reviews');
  assert.equal(evidence.lessonReviews.length, lessonIds.length, 'Review every lesson exactly once');
  const seen = new Set();
  for (const row of evidence.lessonReviews) {
    assert.ok(row && lessonIds.includes(row.lessonId) && !seen.has(row.lessonId), 'Unexpected or duplicate lesson review');
    seen.add(row.lessonId);
    for (const field of ['keyboard', 'zoom200', 'screenReaderPassed', 'contrastPassed']) {
      assert.equal(row[field], true, 'Missing ' + field + ' review for ' + row.lessonId);
    }
    assert.ok(typeof row.notes === 'string' && row.notes.trim().length >= 12 && !/^(?:example|placeholder|todo|n\/a|not reviewed|synthetic|test fixture)\b/i.test(row.notes.trim()), 'Record actual observations for ' + row.lessonId);
  }
}
