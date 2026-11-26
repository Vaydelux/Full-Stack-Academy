import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

test('curriculum and reference index totals match v1.1 specification', () => {
  const curriculum = readJson('data/curriculum.json');
  const refs = readJson('data/reference-index.json');
  const summary = readJson('data/summary.json');

  assert.equal(curriculum.tracks.length, 28);
  assert.equal(curriculum.modules.length, 111);
  assert.equal(curriculum.lessons.length, 889);
  assert.equal(refs.entries.length, 303);

  assert.deepEqual(summary, {
    tracks: 28,
    modules: 111,
    plannedLessons: 889,
    referenceSubjects: 303,
    planningLessonMinutes: summary.planningLessonMinutes,
  });

  const plannedTotal = curriculum.lessons.every((l) => l.status === 'planned');
  assert.equal(plannedTotal, true);
});

test('all four authored sample lessons and four reference drafts exist on disk', () => {
  const curriculum = readJson('data/curriculum.json');
  const lessonIds = new Set(curriculum.lessons.map((l) => l.id));

  for (const id of ['06.01.01', '07.02.01', '09.01.02', '15.02.04']) {
    assert.ok(lessonIds.has(id), `Missing catalog lesson ${id}`);
  }

  const lessonFiles = fs.readdirSync(path.join(ROOT, 'lessons')).filter((f) => f.endsWith('.md'));
  assert.equal(lessonFiles.length, 4);

  const refFiles = fs.readdirSync(path.join(ROOT, 'reference')).filter((f) => f.endsWith('.md'));
  assert.equal(refFiles.length, 4);
});

test('prototype/catalog.js matches JSON source of truth', () => {
  const curriculum = readJson('data/curriculum.json');
  const refs = readJson('data/reference-index.json');
  const raw = fs.readFileSync(path.join(ROOT, 'prototype/catalog.js'), 'utf8');
  assert.ok(raw.startsWith('const CATALOG = '));
  const parsed = JSON.parse(raw.slice('const CATALOG = '.length).replace(/;\s*$/, ''));

  assert.deepEqual(parsed.tracks, curriculum.tracks);
  assert.deepEqual(parsed.modules, curriculum.modules);
  assert.deepEqual(parsed.lessons, curriculum.lessons);
  assert.deepEqual(parsed.reference, refs.entries);
});

test('no leftover boilerplate directories or Nebula/Z.ai references exist in src/', () => {
  const bannedDirs = ['.zscripts', 'Caddyfile', 'mini-services', 'prisma', 'db', 'download', 'upload', 'tailwind.config.ts'];
  for (const rel of bannedDirs) {
    assert.equal(fs.existsSync(path.join(ROOT, rel)), false, `Boilerplate still present: ${rel}`);
  }

  const srcFiles = walkFiles(path.join(ROOT, 'src'));
  const bannedTerms = ['NEBULA', 'Nebula Lab', 'z-ai-web-dev-sdk', 'Instructor Aura', 'ReactOrbit'];
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const term of bannedTerms) {
      assert.equal(
        content.includes(term),
        false,
        `Leftover boilerplate term "${term}" found in ${path.relative(ROOT, file)}`
      );
    }
  }
});

test('all authored reference IDs match reference-index.json exactly', () => {
  const refs = readJson('data/reference-index.json');
  const refIds = new Set(refs.entries.map((r) => r.id));
  const authoredSrc = fs.readFileSync(path.join(ROOT, 'src/lib/academy/authored-content.ts'), 'utf8');

  const expectedIds = [
    'zod-safeparse',
    'prisma-transaction',
    'nestjs-canactivate',
    'nestjs-useguards',
    'redis-set',
    'react-jsx',
    'react-key',
    'react-component',
    'next.js-server-components',
    'next.js-client-components',
  ];
  for (const id of expectedIds) {
    assert.ok(refIds.has(id), `Missing reference id in index: ${id}`);
  }
  const section = authoredSrc.split('export const AUTHORED_REFERENCES')[1]?.split('export function findAuthoredReference')[0];
  assert.ok(section, 'Missing authored reference registry');
  const authoredIds = [...section.matchAll(/^\s*(?:id:\s*'([^']+)'|"id":\s*"([^"]+)")/gm)].map(match => match[1] ?? match[2]);
  assert.equal(new Set(authoredIds).size, authoredIds.length, 'Duplicate authored reference ID');
  assert.deepEqual([...authoredIds].sort(), [...refIds].sort(), 'Authored reference IDs must match the canonical index');
  assert.ok(authoredIds.includes('next.js-next-js-proxy'), 'Canonical Next.js Proxy reference missing');
});

