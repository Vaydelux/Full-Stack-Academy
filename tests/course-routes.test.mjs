import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const data = JSON.parse(read('data/curriculum.json'));
const refs = JSON.parse(read('data/reference-index.json'));
const authoredLessonIds = ['06.01.01', '07.02.01', '09.01.02', '15.02.04'];
const authoredRefIds = ['zod-safeparse', 'prisma-transaction', 'nestjs-canactivate', 'redis-set'];

test('learning and reference routes exist and have unique metadata', () => {
  for (const file of [
    'src/app/learn/page.tsx', 'src/app/learn/track/[trackId]/page.tsx',
    'src/app/learn/[lessonId]/page.tsx', 'src/app/reference/page.tsx',
    'src/app/reference/[referenceId]/page.tsx',
  ]) {
    assert.ok(fs.existsSync(path.join(root, file)), `Missing published route ${file}`);
    assert.match(read(file), /metadata|generateMetadata/);
  }
});

test('published IDs are backed by actual curriculum and reference entries', () => {
  const lessonIds = new Set(data.lessons.map((l) => l.id));
  const refIds = new Set(refs.entries.map((r) => r.id));
  for (const id of authoredLessonIds) assert.ok(lessonIds.has(id), `Unknown authored lesson ${id}`);
  for (const id of authoredRefIds) assert.ok(refIds.has(id), `Unknown authored reference ${id}`);
  assert.equal(data.tracks.length, 28);
  assert.equal(data.modules.length, 111);
});

test('planned topics are explicitly noindex; only published content enters sitemap', () => {
  const lesson = read('src/app/learn/[lessonId]/page.tsx');
  const ref = read('src/app/reference/[referenceId]/page.tsx');
  const sitemap = read('src/app/sitemap.ts');
  assert.match(lesson, /robots: \{ index: Boolean\(authored\), follow: true \}/);
  assert.match(ref, /robots: \{ index: Boolean\(authored\), follow: true \}/);
  assert.match(sitemap, /AUTHORED_LESSON_IDS/);
  assert.match(sitemap, /AUTHORED_REFERENCES/);
  assert.doesNotMatch(sitemap, /summary\.plannedLessons/);
});

test('reading a deep link selects the requested lesson', () => {
  const workspace = read('src/components/workspace/Workspace.tsx');
  assert.match(workspace, /new URLSearchParams\(window\.location\.search\)\.get\('lesson'\)/);
  assert.match(workspace, /selectLesson\(deepLink\)/);
});

test('reference and lesson content includes real examples and completion explanations', () => {
  assert.match(read('src/app/reference/[referenceId]/page.tsx'), /authored\.minimalExample/);
  assert.match(read('src/app/reference/[referenceId]/page.tsx'), /authored\.productionExample/);
  assert.match(read('src/app/learn/[lessonId]/page.tsx'), /authored\.steps\.map/);
  assert.match(read('src/app/learn/[lessonId]/page.tsx'), /authored\.bugHunt/);
  assert.match(read('src/app/learn/[lessonId]/page.tsx'), /This article does not automatically grade code/);
});
