import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=["09.01.01","09.01.02","09.01.03","09.01.04","09.01.05","09.01.06","09.01.07","09.01.08"];
const slugs=["zod-object-primitives","zod-safeparse-issues","zod-optional-defaults","zod-cross-field-refine","zod-transform-coerce","zod-discriminated-requests","zod-composition-types","zod-profile-form"];

test('eight authored Zod 4 lessons have MDX, metadata, rubric, real schema labs and published registry',()=>{
 const registry=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 const pkg=JSON.parse(read('package.json'));
 for(let i=0;i<ids.length;i++){
  const id=ids[i],slug=slugs[i];
  const meta=JSON.parse(read('src/content/lessons/'+id+'.meta.json'));
  const lab=JSON.parse(read('labs/'+slug+'/lab.json'));
  const article=read('src/content/lessons/'+id+'.mdx');
  assert.equal(meta.id,id);assert.equal(meta.moduleId,'09.01');assert.equal(meta.trackId,'09');
  assert.equal(meta.stack.zod,'4');assert.equal(meta.stack.typescript,'5');
  assert.equal(meta.labId,lab.id);assert.equal(lab.lessonId,id);
  assert.ok(meta.rubric.length>=3&&meta.objectives.length>=3);
  assert.ok(meta.sources.every(source=>article.includes(source.url)),id+' references');
  assert.equal((article.match(/<LessonStep\b/g)||[]).length,3,id);
  for(const marker of ['<LearningGoals','<KnowledgeCheck','<Misconception','## Bug Hunt','## Official references',`<LabGate lessonId="${id}"`,'interactive={false}']){
   assert.ok(article.includes(marker),id+' missing '+marker);
  }
  for(const asset of [lab.starter,lab.solution,lab.tests])assert.ok(fs.statSync(path.join(root,asset)).isFile(),asset);
  assert.equal(pkg.scripts['lab:'+slug],'tsx --test labs/'+slug+'/solution.test.mjs');
  assert.ok(registry.includes('./lessons/'+id+'.mdx'));
  assert.ok(published.includes('lessons/'+id+'.meta.json'));
 }
});
test('Zod 4 stack and source publication checkpoint reflect interactive 09.01.02 overlap',()=>{
 const cp=JSON.parse(read('docs/checkpoint.json'));
 assert.ok(cp.snapshot.publishedLessons>=298,'minimum publishedLessons coverage for this milestone');
 assert.ok(cp.snapshot.authoredMdxLessons>=297,'minimum authoredMdxLessons coverage for this milestone');
 assert.ok(cp.snapshot.labFixtures>=297,'minimum labFixtures coverage for this milestone');
 assert.ok(cp.snapshot.completeModules.length>=37,'minimum completeModules.length coverage for this milestone');
 assert.equal(JSON.parse(read('content/stack-versions.json')).zod,'4');
 assert.ok(read('scripts/validate-content.mjs').includes('react|foundation|next|ui|zod'));
 const old=read('src/lib/academy/authored-content.ts');
 assert.ok(old.includes("'09.01.02'"),'preexisting interactive lesson documented');
});
test('the browser-only form imports the exact shared instructor schema and never calls the network',()=>{
 const schema=read('src/lib/academy/zod-profile.ts');
 const page=read('src/app/learn/zod-profile-lab/page.tsx');
 const client=read('src/components/course/ZodProfileLab.tsx');
 const instructor=read('labs/zod-profile-form/solution/solution.ts');
 assert.ok(schema.includes('z.strictObject'));
 assert.ok(instructor.includes("../../../src/lib/academy/zod-profile"));
 assert.ok(client.includes("from '@/lib/academy/zod-profile'"));
 assert.ok(client.includes('validateProfile(form)'));
 assert.ok(client.includes('aria-invalid')&&client.includes('aria-describedby')&&client.includes('role="alert"'));
 assert.ok(!client.includes('fetch(')&&!client.includes('localStorage'));
 assert.ok(page.includes('robots:{index:false'));
 assert.ok(read('src/content/lessons/09.01.08.mdx').includes('/learn/zod-profile-lab'));
});
test('Zod foundation smoke preserves planned React Hook Form noindex boundary',()=>{
 for(const script of ['scripts/browser-smoke.mjs','scripts/ui-track-smoke.mjs','scripts/zod-foundations-smoke.mjs','scripts/next-full-track-smoke.mjs']){
  assert.ok(read(script).includes('09.02.01'),script);
 }
});

test('all 19 canonical Zod reference topics now have authored, source-linked drafts',()=>{
 const category=JSON.parse(read('data/reference-index.json')).entries.filter(x=>x.category==='Zod');
 assert.equal(category.length,19);
 const section=read('src/lib/academy/authored-content.ts').split('export const AUTHORED_REFERENCES')[1].split('export function findAuthoredReference')[0];
 for(const row of category){
  assert.ok(section.includes('"id": "'+row.id+'"')||section.includes("id: '"+row.id+"'"),row.id+' missing authored draft');
 }
 const cp=JSON.parse(read('docs/checkpoint.json'));
 assert.equal(cp.snapshot.authoredReferenceDrafts,38);
});
