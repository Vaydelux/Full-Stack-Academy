import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const ids=["10.01.01","10.01.02","10.01.03","10.01.04","10.01.05","10.01.06","10.01.07","10.01.08","10.02.01","10.02.02","10.02.03","10.02.04","10.02.05","10.02.06","10.02.07","10.02.08"];
const slugs=["node-event-loop-order","node-env-signals","node-stream-buffer-limit","node-fetch-abort","node-path-containment","node-memory-cpu-metrics","node-graceful-lifecycle","node-streaming-upload","http-method-status","http-accept-json","http-safe-json","http-idempotency-retry","http-filter-page","http-rfc9457-problem","http-etag-conditional","http-local-rest-contract"];
test('16 Node and HTTP lessons are canonical, published and lab-backed',()=>{
 const registry=read('src/content/lesson-registry.tsx');
 const pub=read('src/lib/academy/published.ts');
 const pkg=JSON.parse(read('package.json'));
 for(let i=0;i<16;i++){
  const id=ids[i],slug=slugs[i];
  const meta=JSON.parse(read('src/content/lessons/'+id+'.meta.json'));
  const lab=JSON.parse(read('labs/'+slug+'/lab.json'));
  const mdx=read('src/content/lessons/'+id+'.mdx');
  assert.equal(meta.id,id);assert.equal(meta.trackId,'10');assert.equal(meta.moduleId,id.slice(0,5));
  assert.equal(meta.stack.node,'24');assert.equal(meta.stack.typescript,'5');
  assert.equal(meta.labId,lab.id);assert.equal(lab.lessonId,id);
  assert.equal(lab.runtime,'node-24');
  assert.ok(meta.rubric.length>=3&&meta.objectives.length>=3);
  assert.ok(meta.sources.length===2&&meta.sources.every(x=>mdx.includes(x.url)));
  assert.equal((mdx.match(/<LessonStep\b/g)||[]).length,3,id+' steps');
  for(const mark of ['<LearningGoals','<Misconception','<KnowledgeCheck','## Bug Hunt','## Official references','interactive={false}',`<LabGate lessonId="${id}"`])assert.ok(mdx.includes(mark),id+' lacks '+mark);
  for(const file of [lab.starter,lab.solution,lab.tests])assert.ok(fs.statSync(path.join(root,file)).isFile(),file);
  assert.equal(pkg.scripts['lab:'+slug],'node --test labs/'+slug+'/solution.test.mjs');
  assert.ok(registry.includes('./lessons/'+id+'.mdx'));
  assert.ok(pub.includes('lessons/'+id+'.meta.json'));
 }
});
test('release gate and checkpoint include real standalone built-in Node/HTTP suite',()=>{
 const pkg=JSON.parse(read('package.json'));
 const gate=read('scripts/verify-offline.mjs');
 const cp=JSON.parse(read('docs/checkpoint.json'));
 assert.equal(pkg.scripts['test:red-node-http'],'node --test tests/node-http-red-starters.test.mjs');
 assert.ok(pkg.scripts['test:node-http'].includes('labs/http-local-rest-contract/solution.test.mjs'));
 assert.ok(gate.includes("'test:node-http'")&&gate.includes("'test:red-node-http'"));
 assert.ok(read('scripts/validate-content.mjs').includes('zustand|node|http'));
 assert.ok(cp.snapshot.publishedLessons>=322,'minimum publishedLessons coverage for this milestone');
 assert.ok(cp.snapshot.authoredMdxLessons>=321,'minimum authoredMdxLessons coverage for this milestone');
 assert.ok(cp.snapshot.labFixtures>=321,'minimum labFixtures coverage for this milestone');
 assert.ok(cp.snapshot.completeModules.length>=40,'minimum completeModules.length coverage for this milestone');
 assert.equal(cp.snapshot.authoredReferenceDrafts,38);
});
test('HTTP capstone has listener, bounds, error envelopes and conditional caching',()=>{
 const solution=read('labs/http-local-rest-contract/solution/solution.mjs');
 const acceptance=read('labs/http-local-rest-contract/solution.test.mjs');
 assert.ok(solution.includes("from 'node:http'")&&solution.includes('createServer('));
 assert.ok(solution.includes("application/problem+json"));
 assert.ok(solution.includes("Idempotency key conflict"));
 assert.ok(solution.includes('MAX_BYTES=4096'));
 assert.ok(solution.includes('if-none-match'));
 for(const status of ['404','405','415','422','201','409','304','413'])assert.ok(acceptance.includes(status),status+' wire test missing');
 assert.ok(acceptance.includes("127.0.0.1"));
 assert.ok(acceptance.includes('server.close('));
});
test('planned React Hook Form remains unpublished and noindex boundary unchanged',()=>{
 assert.ok(!read('src/lib/academy/published.ts').includes('lessons/09.02.01.meta.json'));
 assert.ok(read('scripts/node-http-track-smoke.mjs').includes('09.02.01'));
 assert.ok(read('scripts/browser-smoke.mjs').includes('verifyNodeHttpTrack'));
});
