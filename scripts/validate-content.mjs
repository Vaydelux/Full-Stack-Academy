import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as z from 'zod';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'src/content/lessons');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const curriculum = json('data/curriculum.json');
const versions = json('content/stack-versions.json');
const packageJson = json('package.json');
const catalogLessons = new Map(curriculum.lessons.map((lesson) => [lesson.id, lesson]));
const VerifySource = z.strictObject({
  label: z.string().min(3),
  url: z.url().refine((url) => new URL(url).protocol === 'https:', 'Official source must be HTTPS'),
});
const LessonMeta = z.strictObject({
  id: z.string().regex(/^\d{2}\.\d{2}\.\d{2}$/),
  // Some canonical topic labels are intentionally concise (MVCC, JOINs, Zod resolvers).
  // Validate against the canonical catalog for short titles below.
  title: z.string().min(4),
  description: z.string().min(40),
  trackId: z.string().regex(/^\d{2}$/),
  moduleId: z.string().regex(/^\d{2}\.\d{2}$/),
  level: z.enum(['Beginner','Intermediate','Advanced']),
  estimatedMinutes: z.number().int().min(5).max(180),
  status: z.enum(['authored', 'verified']),
  reviewedAt: z.iso.date(),
  stack: z.record(z.string(), z.string().min(1)),
  prerequisites: z.array(z.string()),
  objectives: z.array(z.string().min(15)).min(3).max(8),
  labId: z.string().regex(/^lab\.(react|foundation|next|ui|zod|zustand|node|http|security|openapi)\.[a-z0-9-]+$/),
  rubric: z.array(z.string().min(15)).min(3).max(8).optional(),
  sources: z.array(VerifySource).min(2),
});
const LabSchema = z.strictObject({
  id: z.string().min(5),
  lessonId: z.string(),
  title: z.string().min(10),
  runtime: z.string(),
  status: z.enum(['authored', 'verified']),
  starter: z.string(),
  solution: z.string(),
  tests: z.string(),
  verify: z.array(z.string()).min(1),
  expected: z.string().min(20),
  security: z.string().min(20),
});

function safeFile(file) {
  assert.ok(!path.isAbsolute(file), `Absolute path is not allowed: ${file}`);
  const target = path.resolve(root, file);
  assert.ok(target.startsWith(root + path.sep), `Path traverses repository root: ${file}`);
  assert.ok(fs.statSync(target).isFile(), `Missing file: ${file}`);
  return target;
}

const ids = new Set();
const graph = new Map();
const metaFiles = fs.readdirSync(contentDir).filter((name) => name.endsWith('.meta.json')).sort();
assert.ok(metaFiles.length, 'At least one authored lesson is required');
for (const name of metaFiles) {
  const source = JSON.parse(fs.readFileSync(path.join(contentDir,name), 'utf8'));
  const meta = LessonMeta.parse(source);
  assert.ok(!ids.has(meta.id), `Duplicate MDX lesson ID ${meta.id}`);
  ids.add(meta.id);
  const entry = catalogLessons.get(meta.id);
  assert.ok(entry, `MDX lesson absent from canonical curriculum: ${meta.id}`);
  assert.ok(meta.title === entry.title || meta.title.length >= 15,
    `Short published lesson title must exactly match its canonical topic: ${meta.id}`);
  assert.equal(meta.trackId, entry.trackId);
  assert.equal(meta.moduleId, entry.moduleId);
  assert.equal(meta.level, entry.level);
  assert.equal(name, `${meta.id}.meta.json`);
  if (meta.labId.startsWith('lab.foundation.')) assert.ok(meta.rubric?.length, 'Local labs need a completion rubric');
  assert.ok(read('src/content/lesson-registry.tsx').includes(`./lessons/${meta.id}.mdx`), `No MDX registry entry: ${meta.id}`);
  assert.ok(read('src/lib/academy/published.ts').includes(`lessons/${meta.id}.meta.json`), `No metadata registry entry: ${meta.id}`);
  for (const [technology, major] of Object.entries(meta.stack)) {
    assert.equal(versions[technology], major, `Unpinned/mismatched ${technology} version in ${meta.id}`);
  }
  for (const prerequisite of meta.prerequisites) {
    assert.ok(catalogLessons.has(prerequisite), `Unknown prerequisite ${prerequisite} in ${meta.id}`);
    assert.notEqual(prerequisite, meta.id, `A lesson cannot depend on itself`);
  }
  graph.set(meta.id, meta.prerequisites);
  const body = read(`src/content/lessons/${meta.id}.mdx`);
  for (const required of [
    '## The problem', '## Build the mental model', '<LearningGoals', '<LessonStep',
    '<KnowledgeCheck', '<LabGate', '## Bug Hunt', '## Official references',
  ]) {
    assert.ok(body.includes(required), `Missing required pedagogy "${required}" in ${meta.id}`);
  }
  assert.ok((body.match(/<LessonStep\b/g) ?? []).length >= 3, `Lesson ${meta.id} needs at least 3 guided steps`);
  assert.ok(!/-----BEGIN (?:RSA |EC )?PRIVATE KEY-----|SUPABASE_SERVICE_ROLE_KEY\s*=\s*\S+/i.test(body), 'Do not publish secrets in MDX');
  for (const source of meta.sources) {
    assert.ok(body.includes(source.url), `Official reference is not linked in lesson: ${source.url}`);
  }

  const lab = LabSchema.parse(json(`labs/${meta.labId.split('.').at(-1)}/lab.json`));
  assert.equal(lab.id, meta.labId);
  assert.equal(lab.lessonId, meta.id);
  for (const asset of [lab.starter,lab.solution,lab.tests]) safeFile(asset);
  for (const command of lab.verify) {
    assert.ok(command.startsWith('npm run '), `Unsafe/unbounded lab verifier command: ${command}`);
    assert.ok(packageJson.scripts[command.slice('npm run '.length)], `Undefined lab verifier script: ${command}`);
  }
}
function checkCycle(node, visiting = new Set(), visited = new Set()) {
  if (visited.has(node)) return;
  assert.ok(!visiting.has(node), `Prerequisite cycle involving ${node}`);
  visiting.add(node);
  for (const dep of graph.get(node) ?? []) {
    if (graph.has(dep)) checkCycle(dep, visiting, visited);
  }
  visiting.delete(node);
  visited.add(node);
}
const visited = new Set();
for (const id of graph.keys()) checkCycle(id,new Set(),visited);
console.log(`Content OK: ${ids.size} MDX lesson(s), metadata, source links and lab fixture manifests validated.`);
