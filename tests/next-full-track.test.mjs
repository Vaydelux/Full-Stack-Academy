import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=["07.02.01","07.02.02","07.02.03","07.02.04","07.02.05","07.02.06","07.02.07","07.02.08","07.03.01","07.03.02","07.03.03","07.03.04","07.03.05","07.03.06","07.03.07","07.03.08","07.04.01","07.04.02","07.04.03","07.04.04","07.04.05","07.04.06","07.04.07","07.04.08","07.05.01","07.05.02","07.05.03","07.05.04","07.05.05","07.05.06","07.05.07","07.05.08"];
const names=["next-server-client-boundary","next-rsc-request-lifecycle","next-serialization-projection","next-server-action-authorization","next-route-handler-bff","next-suspense-streaming","next-server-only-secrets","next-accidental-client-import","next-fetch-behavior","next-explicit-cache-boundary","next-cache-tags","next-cache-revalidation","next-private-cache-risks","next-rendering-strategies","next-cache-debugging","next-publish-revalidate-capstone","next-semantic-metadata","next-canonical-og","next-sitemap-robots","next-jsonld-safe","next-images-fonts-lcp","next-core-web-vitals","next-content-architecture","next-seo-audit-capstone","next-environment-separation","next-proxy-host-guard","next-image-assets","next-node-edge-runtime","next-error-redaction","next-diagnostic-triage","next16-migration-audit","next-tenant-cache-leak"];
test('32 Next.js 16 lessons have canonical metadata, deep MDX and local lab fixtures',()=>{
 const registry=read('src/content/lesson-registry.tsx');
 const published=read('src/lib/academy/published.ts');
 const pkg=JSON.parse(read('package.json'));
 for(let i=0;i<ids.length;i++){
  const id=ids[i],name=names[i];
  const meta=JSON.parse(read('src/content/lessons/'+id+'.meta.json'));
  const lab=JSON.parse(read('labs/'+name+'/lab.json'));
  const body=read('src/content/lessons/'+id+'.mdx');
  assert.equal(meta.id,id);assert.equal(meta.trackId,'07');assert.equal(meta.moduleId,id.slice(0,5));
  assert.equal(meta.stack.next,'16');assert.equal(meta.stack.typescript,'5');
  assert.equal(meta.labId,lab.id);assert.equal(lab.lessonId,id);
  assert.equal(meta.level,'Intermediate');
  assert.ok(meta.rubric.length>=3&&meta.objectives.length>=3);
  assert.ok(meta.sources.every(x=>body.includes(x.url)),id+' sources');
  assert.equal((body.match(/<LessonStep\b/g)||[]).length,3,id+' steps');
  for(const token of ['<LearningGoals','<KnowledgeCheck','<Misconception','## Bug Hunt','## Official references',`<LabGate lessonId="${id}"`,'interactive={false}']){
   assert.ok(body.includes(token),id+' lacks '+token);
  }
  for(const asset of [lab.starter,lab.solution,lab.tests])assert.ok(fs.statSync(path.join(root,asset)).isFile(),asset);
  assert.equal(pkg.scripts['lab:'+name],'tsx --test labs/'+name+'/solution.test.mjs');
  assert.equal(pkg.scripts['test:labs'],'node scripts/run-local-labs.mjs');
  assert.ok(registry.includes('./lessons/'+id+'.mdx'));
  assert.ok(published.includes('lessons/'+id+'.meta.json'));
 }
});
test('new noindex boundary is the first planned Zod lesson',()=>{
 for(const p of ['scripts/browser-smoke.mjs','scripts/react-batch-smoke.mjs','scripts/react-advanced-smoke.mjs','scripts/react-next-milestone-smoke.mjs','scripts/next-full-track-smoke.mjs']){
  assert.ok(read(p).includes('09.02.01'),p);
 }
 const cp=JSON.parse(read('docs/checkpoint.json'));
 assert.ok(cp.snapshot.publishedLessons>=259,'minimum publishedLessons coverage for this milestone');
 assert.ok(cp.snapshot.authoredMdxLessons>=257,'minimum authoredMdxLessons coverage for this milestone');
 assert.ok(cp.snapshot.labFixtures>=257,'minimum labFixtures coverage for this milestone');
 assert.ok(cp.snapshot.completeModules.length>=32,'minimum completeModules.length coverage for this milestone');
});
test('Next 16 cache and secret boundaries are not silently represented as browser integration',()=>{
 const cache=read('src/content/lessons/07.03.04.mdx');
 assert.match(cache,/revalidateTag/);assert.match(cache,/updateTag/);
 const security=read('src/content/lessons/07.05.08.mdx');
 assert.match(security,/cross-tenant/i);assert.match(security,/separate integration evidence|negative HTTP|real backend|tenant/i);
});
