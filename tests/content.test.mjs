import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

test('MDX integration is compile-time and never compiles learner input', () => {
  const nextConfig = read('next.config.ts');
  const mdx = read('mdx-components.tsx');
  const page = read('src/app/learn/[lessonId]/page.tsx');
  assert.match(nextConfig, /@next\/mdx/);
  assert.match(nextConfig, /withMDX/);
  assert.match(mdx, /useMDXComponents/);
  assert.match(page, /LessonArticle/);
  assert.doesNotMatch(page, /evaluate\s*\(|new Function|eval\s*\(/);
});

test('authored lesson is rich MDX with a real lab and versioned metadata', () => {
  const mdx = read('src/content/lessons/06.01.01.mdx');
  const meta = JSON.parse(read('src/content/lessons/06.01.01.meta.json'));
  const lab = JSON.parse(read('labs/jsx-skill-card/lab.json'));
  assert.equal(meta.id,'06.01.01');
  assert.equal(meta.labId,lab.id);
  assert.equal(lab.lessonId,meta.id);
  assert.ok((mdx.match(/<LessonStep\b/g) ?? []).length >= 3);
  assert.match(mdx, /<KnowledgeCheck/);
  assert.match(mdx, /<LabGate/);
});

test('quality workflow executes both content and lab verification', () => {
  const ci = read('.github/workflows/academy-quality.yml');
  const pkg = JSON.parse(read('package.json'));
  assert.match(ci,/npm run verify:content/);
  assert.match(ci,/npm run test:labs/);
  for (const testFile of ['tests/academy.test.mjs', 'tests/hardening.test.mjs', 'tests/course-routes.test.mjs', 'tests/content.test.mjs', 'tests/react-modules.test.mjs', 'tests/react-interaction-source.test.mjs']) {
    assert.ok(pkg.scripts.test.includes(testFile), `Missing required test file: ${testFile}`);
  }
});

test('local labs are registered and have a real completion rubric', () => {
  for (const id of ["00.01.01","00.01.02","00.01.03","00.01.04","00.01.05","00.01.06","00.01.07","00.01.08","00.02.01","00.02.02","00.02.03","00.02.04","00.02.05","00.02.06","00.02.07","00.02.08"]) {
    const meta=JSON.parse(read('src/content/lessons/'+id+'.meta.json'));
    assert.ok(meta.rubric.length>=3);
    assert.ok(read('src/content/lesson-registry.tsx').includes(id));
  }
});
