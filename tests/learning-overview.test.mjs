import test from 'node:test';
import assert from 'node:assert/strict';
import { createLearningOverview } from '../src/lib/academy/learning-overview.ts';

const lessons = [
  { id: '01.01.01', moduleId: '01.01', title: 'Semantic HTML', minutes: 20 },
  { id: '01.01.02', moduleId: '01.01', title: 'Document sections', minutes: 25 },
  { id: '02.01.01', moduleId: '02.01', title: 'CSS Cascade', minutes: 15 },
];
const empty = () => ({
  complete: {}, quizzes: {}, rubrics: {}, notes: {}, reflections: {},
});

test('counts only published catalog records, never arbitrary backup keys', () => {
  const progress = { ...empty(), complete: { '99.99.99': true, '01.01.01': true } };
  const overview = createLearningOverview(lessons, progress, { '01.01': 'HTML', '02.01': 'CSS' });
  assert.equal(overview.total, 3);
  assert.equal(overview.completed, 1);
  assert.equal(overview.remainingMinutes, 40);
  assert.deepEqual(overview.modules.map(m => [m.title, m.completed]), [['HTML', 1], ['CSS', 0]]);
  assert.equal(overview.nextLesson?.id, '01.01.02');
});

test('prefers resuming a started lesson over an untouched earlier lesson', () => {
  const progress = { ...empty(), quizzes: { '02.01.01': true }, notes: { '01.01.02': 'draft' } };
  const overview = createLearningOverview(lessons, progress);
  assert.equal(overview.started, 2);
  assert.equal(overview.nextLesson?.id, '01.01.02');
  assert.equal(overview.modules[1].nextLesson?.id, '02.01.01');
});

test('completed lessons are not counted as in-progress even if notes exist', () => {
  const progress = {
    ...empty(),
    complete: { '01.01.01': true },
    notes: { '01.01.01': 'saved note' },
  };
  const overview = createLearningOverview(lessons, progress);
  assert.equal(overview.completed, 1);
  assert.equal(overview.started, 0);
});

test('deduplicates catalog entries and clamps invalid minute estimates', () => {
  const overview = createLearningOverview([
    lessons[0], lessons[0], { ...lessons[1], minutes: Number.POSITIVE_INFINITY },
    { ...lessons[2], minutes: -20 },
  ], empty());
  assert.equal(overview.total, 3);
  assert.equal(overview.remainingMinutes, 20);
});

test('fully completed catalog has no unfinished recommendation', () => {
  const progress = {
    ...empty(),
    complete: Object.fromEntries(lessons.map(x => [x.id, true])),
  };
  const overview = createLearningOverview(lessons, progress);
  assert.equal(overview.nextLesson, null);
  assert.equal(overview.remainingMinutes, 0);
  assert.ok(overview.modules.every(m => m.nextLesson === null));
});

test('module recommendation prefers a started lesson within its own module', () => {
  const progress = { ...empty(), rubrics: { '01.01.02': [0] } };
  const overview = createLearningOverview(lessons, progress);
  assert.equal(overview.modules[0].nextLesson?.id, '01.01.02');
});
