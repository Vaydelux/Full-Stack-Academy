import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=["06.05.01","06.05.02","06.05.03","06.05.04","06.05.05","06.05.06","06.05.07","06.05.08","07.01.01","07.01.02","07.01.03","07.01.04","07.01.05","07.01.06","07.01.07","07.01.08"];
const names=["react-testing-library-intro","react-accessible-queries","react-user-journey","react-profiler-diagnosis","react-memo-evidence","react-usememo-callback-cost","react-concurrent-rendering","react-unstable-keys-capstone","next-route-segments","next-layout-template","next-async-dynamic-params","next-loading-error-boundaries","next-notfound-redirects","next-navigation-prefetch","next-metadata-favicons","next-public-site-capstone"];
test('16 React/Next lesson metadata, lab fixtures and publication registration are consistent',()=>{
 const registry=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 const packageJson=JSON.parse(read('package.json'));
 for(let i=0;i<ids.length;i++){
  const id=ids[i],name=names[i];
  const meta=JSON.parse(read('src/content/lessons/'+id+'.meta.json'));
  const lab=JSON.parse(read('labs/'+name+'/lab.json'));
  const body=read('src/content/lessons/'+id+'.mdx');
  assert.equal(meta.id,id);assert.equal(meta.moduleId,id.slice(0,5));
  assert.equal(meta.level,i<8?'Beginner':'Intermediate');
  assert.equal(meta.labId,lab.id);assert.equal(lab.lessonId,id);
  assert.ok(meta.rubric.length>=3,id+' needs completion rubric');
  assert.ok(meta.sources.every(x=>body.includes(x.url)),id+' links sources');
  assert.equal((body.match(/<LessonStep\b/g)||[]).length,3,id+' needs three steps');
  assert.ok(body.includes('<KnowledgeCheck')&&body.includes('<Misconception'));
  assert.ok(body.includes('<LabGate lessonId="'+id+'"'));
  assert.ok(body.includes('interactive={false}'));
  assert.ok(registry.includes("./lessons/"+id+".mdx"));
  assert.ok(published.includes("lessons/"+id+".meta.json"));
  for(const asset of [lab.starter,lab.solution,lab.tests])assert.ok(fs.statSync(path.join(root,asset)).isFile(),asset);
  assert.equal(packageJson.scripts['lab:'+name],'tsx --test labs/'+name+'/solution.test.mjs');
  assert.equal(packageJson.scripts['test:labs'],'node scripts/run-local-labs.mjs');
 }
});
test('Next.js 16 capstone includes App Router file conventions and async params',()=>{
 for(const asset of ['layout.tsx','page.tsx','loading.tsx','error.tsx','not-found.tsx','products/[slug]/page.tsx']) {
  assert.ok(fs.statSync(path.join(root,'labs/next-public-site/solution/app',asset)).isFile(),asset);
 }
 const dynamic=read('labs/next-public-site/solution/app/products/[slug]/page.tsx');
 assert.match(dynamic,/await params/);assert.match(dynamic,/notFound\(\)/);
 const error=read('labs/next-public-site/solution/app/error.tsx');
 assert.ok(error.startsWith("'use client';"));
});
test('source registries mark next planned module 09.02.01 noindex',()=>{
 assert.ok(read('scripts/validate-content.mjs').includes('react|foundation|next'));
 for(const script of ['scripts/browser-smoke.mjs','scripts/react-batch-smoke.mjs','scripts/react-advanced-smoke.mjs','scripts/react-next-milestone-smoke.mjs']){
  assert.ok(read(script).includes('09.02.01'),script);
 }
});
