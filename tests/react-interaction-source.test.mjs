import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
test('React browser practice runs real handlers without compiling learner code',()=>{
  const component=read('src/components/course/ReactStateLab.tsx');
  const page=read('src/app/learn/react-state-lab/page.tsx');
  const smoke=read('scripts/react-batch-smoke.mjs');
  assert.ok(component.startsWith("'use client';"));
  assert.match(component,/setScore\(\(prior\) => prior \+ 1\)/);
  assert.match(component,/key=\{selectedPerson\}/);
  assert.match(component,/dispatch\(\{ type: 'toggle'/);
  assert.match(page,/robots: \{ index: false, follow: true \}/);
  assert.match(smoke,/getByRole\('button',\{name:'Add 2 points'\}\)/);
  assert.doesNotMatch(component,/\beval\s*\(|\bnew Function\s*\(/);
});
