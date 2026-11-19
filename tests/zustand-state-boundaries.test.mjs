import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=["09.04.01","09.04.02","09.04.03","09.04.04","09.04.05","09.04.06","09.04.07","09.04.08"];
const slugs=["zustand-local-url-server","zustand-selectors-slices","zustand-persist-private","zustand-derived-subscription","zustand-multitab-revisions","zustand-url-search-state","zustand-dont-cache-records","zustand-filter-preference-capstone"];
test('eight 09.04 Zustand 5 lessons have exact metadata, published MDX, rubric and local store tests',()=>{
 const registry=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 const pkg=JSON.parse(read('package.json'));
 for(let i=0;i<ids.length;i++){
  const id=ids[i],slug=slugs[i];
  const meta=JSON.parse(read('src/content/lessons/'+id+'.meta.json'));
  const lab=JSON.parse(read('labs/'+slug+'/lab.json'));
  const body=read('src/content/lessons/'+id+'.mdx');
  assert.equal(meta.id,id);assert.equal(meta.trackId,'09');assert.equal(meta.moduleId,'09.04');
  assert.equal(meta.stack.zustand,'5');assert.equal(meta.stack.react,'19');assert.equal(meta.stack.typescript,'5');
  assert.equal(lab.id,meta.labId);assert.equal(lab.lessonId,id);
  assert.ok(meta.rubric.length>=3&&meta.objectives.length>=3&&meta.sources.length===2);
  assert.ok(meta.sources.every(s=>body.includes(s.url)),id+' references');
  assert.equal((body.match(/<LessonStep\b/g)||[]).length,3,id+' steps');
  for(const marker of ['<LearningGoals','<KnowledgeCheck','<Misconception','## Bug Hunt','## Official references',`<LabGate lessonId="${id}"`,'interactive={false}'])
   assert.ok(body.includes(marker),id+' missing '+marker);
  for(const asset of [lab.starter,lab.solution,lab.tests])assert.ok(fs.statSync(path.join(root,asset)).isFile(),asset);
  assert.equal(pkg.scripts['lab:'+slug],'tsx --test labs/'+slug+'/solution.test.mjs');
  assert.ok(registry.includes('./lessons/'+id+'.mdx'));
  assert.ok(published.includes('lessons/'+id+'.meta.json'));
 }
});
test('Zustand uses actual dependency and planned first React Hook Form lesson remains unpublished',()=>{
 const pkg=JSON.parse(read('package.json'));
 assert.ok(pkg.dependencies.zustand.startsWith('^5.'));
 assert.equal(JSON.parse(read('content/stack-versions.json')).zustand,'5');
 assert.ok(read('scripts/validate-content.mjs').includes('react|foundation|next|ui|zod|zustand'));
 assert.equal(pkg.scripts['test:red-zustand-state'],'node --test tests/zustand-state-red-starters.test.mjs');
 assert.equal(pkg.scripts['test:labs'],'node scripts/run-local-labs.mjs');
 const cp=JSON.parse(read('docs/checkpoint.json'));
 assert.equal(cp.snapshot.publishedLessons,306);
 assert.equal(cp.snapshot.authoredMdxLessons,305);
 assert.equal(cp.snapshot.labFixtures,305);
 assert.equal(cp.snapshot.completeModules.length,38);
 assert.ok(!read('src/lib/academy/published.ts').includes('lessons/09.02.01.meta.json'));
});
test('browser lab imports the same real vanilla Zustand store and no remote data cache',()=>{
 const code=read('src/components/course/StateBoundariesLab.tsx');
 const store=read('src/lib/academy/zustand-filters.ts');
 const instructor=read('labs/zustand-filter-preference-capstone/solution/solution.ts');
 const page=read('src/app/learn/state-boundaries-lab/page.tsx');
 assert.ok(code.startsWith("'use client';"));
 assert.ok(code.includes('useStore(store,state=>state.query)'));
 assert.ok(code.includes('useState(createAcademyFilterStore)'));
 assert.ok(code.includes('aria-live')&&code.includes('aria-pressed'));
 assert.ok(!code.includes('fetch(')&&!code.includes('localStorage'));
 assert.ok(store.includes("from 'zustand/vanilla'")&&store.includes('createStore<AcademyFilterState>()'));
 assert.ok(instructor.includes("../../../src/lib/academy/zustand-filters"));
 assert.ok(page.includes('robots:{index:false'));
 assert.ok(read('src/content/lessons/09.04.08.mdx').includes('/learn/state-boundaries-lab'));
});
test('local browser smoke checks 09.02.01 noindex and real Zustand practice',()=>{
 assert.ok(read('scripts/zustand-state-smoke.mjs').includes('09.02.01'));
 assert.ok(read('scripts/browser-smoke.mjs').includes('verifyZustandState'));
});
