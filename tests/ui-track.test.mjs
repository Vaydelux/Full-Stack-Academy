import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=["08.01.01","08.01.02","08.01.03","08.01.04","08.01.05","08.01.06","08.01.07","08.01.08","08.02.01","08.02.02","08.02.03","08.02.04","08.02.05","08.02.06","08.02.07","08.02.08","08.03.01","08.03.02","08.03.03","08.03.04","08.03.05","08.03.06","08.03.07","08.03.08","08.04.01","08.04.02","08.04.03","08.04.04","08.04.05","08.04.06","08.04.07","08.04.08"];
const slugs=["ui-tailwind-v4","ui-css-theme-tokens","ui-radix-dialog","ui-shadcn-adapter","ui-variant-classes","ui-contrast-themes","ui-responsive-nav","ui-component-gallery","ui-motion-reduced","ui-modal-accessibility","ui-combobox-filter","ui-focus-loop","ui-toast-queue","ui-reorder-keyboard","ui-chart-summary","ui-dropdown-bug-hunt","ui-table-columns","ui-controlled-table","ui-virtual-window","ui-mobile-table-view","ui-table-empty-error","ui-optimistic-table","ui-safe-csv-export","ui-operational-console","ui-visual-rhythm","ui-color-type-system","ui-form-error-contract","ui-heuristic-severity","ui-reduced-motion-audit","ui-browser-coverage","ui-cls-reserved-space","ui-ux-audit-capstone"];

test('all 32 Track 08 lessons are canonical, registered, rubric-backed and have offline labs',()=>{
 const registry=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 const pkg=JSON.parse(read('package.json'));
 for(let i=0;i<ids.length;i++){
  const id=ids[i],slug=slugs[i],meta=JSON.parse(read('src/content/lessons/'+id+'.meta.json'));
  const lab=JSON.parse(read('labs/'+slug+'/lab.json'));
  const body=read('src/content/lessons/'+id+'.mdx');
  assert.equal(meta.id,id);assert.equal(meta.trackId,'08');assert.equal(meta.moduleId,id.slice(0,5));
  assert.equal(meta.level,'Intermediate');assert.equal(meta.stack.typescript,'5');assert.equal(meta.stack.react,'19');
  assert.equal(meta.labId,lab.id);assert.equal(lab.lessonId,id);
  assert.ok(meta.rubric.length>=3&&meta.objectives.length>=3);
  assert.ok(meta.sources.every(s=>body.includes(s.url)),id+' source links');
  assert.equal((body.match(/<LessonStep\b/g)||[]).length,3,id+' guided steps');
  for(const marker of ['<LearningGoals','<KnowledgeCheck','<Misconception','## Bug Hunt','## Official references',`<LabGate lessonId="${id}"`,'interactive={false}']){
   assert.ok(body.includes(marker),id+' missing '+marker);
  }
  for(const asset of [lab.starter,lab.solution,lab.tests])assert.ok(fs.statSync(path.join(root,asset)).isFile(),asset);
  assert.equal(pkg.scripts['lab:'+slug],'tsx --test labs/'+slug+'/solution.test.mjs');
  assert.equal(pkg.scripts['test:labs'],'node scripts/run-local-labs.mjs');
  assert.ok(registry.includes('./lessons/'+id+'.mdx'));
  assert.ok(published.includes('lessons/'+id+'.meta.json'));
 }
});
test('full UI course snapshot and planned Zod noindex boundary stay aligned',()=>{
 const cp=JSON.parse(read('docs/checkpoint.json'));
 assert.ok(cp.snapshot.publishedLessons>=291,'minimum publishedLessons coverage for this milestone');
 assert.ok(cp.snapshot.authoredMdxLessons>=289,'minimum authoredMdxLessons coverage for this milestone');
 assert.ok(cp.snapshot.labFixtures>=289,'minimum labFixtures coverage for this milestone');
 assert.ok(cp.snapshot.completeModules.length>=36,'minimum completeModules.length coverage for this milestone');
 assert.match(read('scripts/validate-content.mjs'),/react\|foundation\|next\|ui/);
 for(const path of ['scripts/browser-smoke.mjs','scripts/next-full-track-smoke.mjs','scripts/ui-track-smoke.mjs']){
  assert.ok(read(path).includes('09.02.01'),path);
 }
});
test('UI Gallery is a real local interactive React client component and an accessible lesson link',()=>{
 const gallery=read('src/components/course/UiComponentGallery.tsx');
 const route=read('src/app/learn/ui-gallery/page.tsx');
 const lesson=read('src/content/lessons/08.01.08.mdx');
 assert.ok(gallery.startsWith("'use client';"));
 for(const token of ["aria-pressed","aria-invalid","aria-describedby","aria-live","role=\"status\"","Preview theme","Preview width","Validate form","Show sample code"]){
  assert.ok(gallery.includes(token),token);
 }
 assert.match(route,/robots: \{ index: false/);
 assert.match(route,/<UiComponentGallery/);
 assert.ok(lesson.includes('/learn/ui-gallery'));
});
test('React, Tailwind 4 and shadcn provider choices are documented without unpinned imports in lab execution',()=>{
 const css=read('src/content/lessons/08.01.01.mdx');
 const adapters=read('src/content/lessons/08.01.04.mdx');
 assert.ok(css.includes('@import "tailwindcss"'));
 assert.ok(adapters.includes('Base UI')&&adapters.includes('Radix'));
 const pkg=JSON.parse(read('package.json'));
 assert.equal(pkg.scripts['test:red-ui-track'],'node --test tests/ui-track-red-starters.test.mjs');
});

test('eight CSS quick references correspond to canonical index entries',()=>{
 const ids=['css-var','css-media','css-container','css-layer','css-focus-visible','css-prefers-reduced-motion','css-color-scheme','css-clamp'];
 const indexed=new Set(JSON.parse(read('data/reference-index.json')).entries.map(x=>x.id));
 const section=read('src/lib/academy/authored-content.ts').split('export const AUTHORED_REFERENCES')[1].split('export function findAuthoredReference')[0];
 for(const id of ids){
  assert.ok(indexed.has(id),id+' not canonical');
  assert.ok(section.includes('"id": "'+id+'"'),id+' no authored draft');
 }
 const cp=JSON.parse(read('docs/checkpoint.json'));
 assert.equal(cp.snapshot.authoredReferenceDrafts,38);
});

test('manifest-based local lab runner avoids Windows command-line limits and checks file scope',()=>{
 const runner=read('scripts/run-local-labs.mjs');
 const pkg=JSON.parse(read('package.json'));
 assert.equal(pkg.scripts['test:labs'],'node scripts/run-local-labs.mjs');
 assert.ok(runner.includes('manifest.tests'));
 assert.ok(runner.includes('spawnSync(process.execPath'));
 assert.ok(runner.includes('batchSize=20'));
 assert.ok(runner.includes('!resolved.startsWith(root+path.sep)'));
});
