import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = file => readFileSync(resolve(root, file), 'utf8');

test('bookmarks are backward-compatible with v1 backup and restricted to published IDs', () => {
  const store = read('src/lib/academy/store.ts');
  const discovery = read('src/lib/academy/lesson-discovery.ts');
  assert.match(store, /bookmarks: z\.record\(z\.string\(\), z\.boolean\(\)\)\.default\(\{\}\)/);
  assert.match(store, /bookmarks: normalizeBookmarks\(input\.bookmarks, PUBLISHED_LESSON_IDS\)/);
  assert.match(store, /version: z\.literal\(1\)/);
  assert.match(store, /const restored = normalizeProgress\(result\.data\.data\)/);
  assert.match(discovery, /Object\.hasOwn\(imported, id\)/);
  assert.match(store, /if \(!PUBLISHED_LESSON_IDS\.includes\(lessonId\)\) return \{\}/);
});

test('lesson notes, bookmarks, and saved dashboard are wired without publishing planned lessons', () => {
  const article = read('src/app/learn/[lessonId]/page.tsx');
  const notebook = read('src/components/course/LessonNotebook.tsx');
  const dashboard = read('src/components/course/LearningDashboard.tsx');
  assert.match(article, /\(authored \|\| mdxMeta\) && <LessonNotebook/);
  assert.match(notebook, /aria-pressed=\{bookmarked\}/);
  assert.match(notebook, /maxLength=\{20000\}/);
  assert.match(notebook, /Unsaved edits/);
  assert.match(dashboard, /<SavedLessonShelf catalog=\{publishedCatalog\}/);
  assert.match(read('src/app/sitemap.ts'), /PUBLISHED_LESSON_IDS/);
});

test('published-only catalog uses bounded progressive discovery not a 338-card static wall', () => {
  const page = read('src/app/learn/page.tsx');
  const ui = read('src/components/course/PublishedLessonExplorer.tsx');
  assert.match(page, /<PublishedLessonExplorer catalog=\{publishedCatalog\}/);
  assert.doesNotMatch(page, /aria-labelledby="published-title"/);
  assert.match(ui, /type="search"/);
  assert.match(ui, /aria-live="polite"/);
  assert.match(ui, /setVisible\(n => n \+ 12\)/);
  assert.match(read('src/lib/academy/lesson-discovery.ts'), /catalogDistinct\(catalog\)/);
});

test('local sync stays origin-bound and registered only in the browser', () => {
  const component = read('src/components/course/ProgressStorageSync.tsx');
  assert.match(read('src/app/layout.tsx'), /<ProgressStorageSync \/>/);
  assert.match(component, /'use client'/);
  assert.match(component, /window\.addEventListener\('storage', onStorage\)/);
  assert.match(component, /event\.storageArea !== storage/);
  assert.match(component, /event\.key === STORAGE_KEY/);
  assert.match(component, /window\.removeEventListener\('storage', onStorage\)/);
});

test('new saved session priority respects the existing prerequisite gate', () => {
  const planner = read('src/lib/academy/study-plan.ts');
  assert.match(planner, /progress\.bookmarks\?\.\[id\] === true/);
  assert.match(planner, /ready\.filter\(/);
  assert.match(planner, /known\.has\(id\) && done\.has\(id\)/);
  assert.match(read('tests/study-plan.test.mjs'), /bookmarked eligible lessons/);
});

test('new workflow has no dependency lockfile edits or invented published lessons', () => {
  const checkpoint = JSON.parse(read('docs/checkpoint.json'));
  assert.equal(checkpoint.snapshot.publishedLessons, 338);
  assert.equal(checkpoint.snapshot.authoredMdxLessons, 337);
  assert.equal(checkpoint.snapshot.labFixtures, 337);
  assert.doesNotMatch(read('src/app/learn/page.tsx'), /react-hook-form|@tanstack\/react-query/);
});

test('failed browser storage writes surface an explicit warning', () => {
  const store = read('src/lib/academy/store.ts');
  const notebook = read('src/components/course/LessonNotebook.tsx');
  const shelf = read('src/components/course/SavedLessonShelf.tsx');
  assert.match(store, /storageError = !savePersisted\(next\)/);
  assert.match(notebook, /Browser storage is unavailable or full/);
  assert.match(shelf, /Browser storage could not save/);
});
