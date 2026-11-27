/** Read-only chained P3 source projection from the qualified P1/P2 review fixture. */
import assert from 'node:assert/strict';
import {buildPersistencePlan} from './persistence-release-plan.mjs';
import {projectSqlModule} from './f9-publication.mjs';
import {projectPersistenceReview} from './persistence-review-projection.mjs';
import {projectionFingerprint} from './forms-query-projection-integrity.mjs';
import {suites} from './p4-runtime-evidence.mjs';
import {REVIEW_FIXTURE_STATUS} from './p1-publication-review.mjs';

const shared=new Set(['package.json','src/content/lesson-registry.tsx','src/lib/academy/published.ts']);
export function appendReviewProjection(previous,next){
 const merged=new Map(previous);
 for(const [file,body] of next){
  assert.ok(!merged.has(file)||shared.has(file),'Unexpected predecessor overwrite: '+file);
  merged.set(file,body);
 }
 return merged;
}
export function rehearseP3Source({checkpoint,catalog,read,exists}){
 assert.equal(checkpoint.status,REVIEW_FIXTURE_STATUS);
 assert.equal(checkpoint.development.state,REVIEW_FIXTURE_STATUS);
 assert.equal(checkpoint.snapshot.publishedLessons,386);
 for(const id of ['09.02','09.03','11.01','11.02','11.03','11.04'])assert.ok(checkpoint.snapshot.completeModules.includes(id));
 return projectPersistenceChain({baseline:386,catalog,read,exists});
}
/** Pure source-only projection; never write to the checkout. Baseline 338 is a standalone audit, not a prerequisite-qualified fixture. */
export function projectPersistenceChain({baseline,catalog,read,exists}){
 assert.ok([338,386].includes(baseline),'Unexpected source projection baseline');
 const modules=buildPersistencePlan(catalog,read).modules;
 let overlay=new Map(),records=[];
 for(const [i,id] of ['12.01','12.02','12.03','12.04','12.05'].entries()){
  assert.ok(!exists('src/content/lessons/'+id+'.01.mdx'),'Already published module');
  const m=modules.find(m=>m.id===id),mixed=i>=3;
  const virtualRead=p=>overlay.has(p)?overlay.get(p):read(p);
  const virtualExists=p=>overlay.has(p)||exists(p);
  const projection=(mixed?projectPersistenceReview:projectSqlModule)(m,catalog,virtualRead,virtualExists);
  assert.equal(projection.publicationApproved,false);
  assert.equal(projection.writes.size,59);
  if(mixed)assert.equal(projection.applicable,false);
  const lessons=[...projection.writes].filter(([p])=>p.endsWith('.mdx'));
  assert.equal(lessons.length,8);
  for(const [,body] of lessons)if(mixed){
   assert.match(body,/NOT PUBLISHED/);
   assert.doesNotMatch(body,/<LabGate\b/);
  }else assert.match(body,/<LabGate\b/);
  overlay=appendReviewProjection(overlay,projection.writes);
  records.push({moduleId:id,projectedLessons:baseline+8*(i+1),sourceFingerprint:m.fingerprint,projectionFingerprint:projection.fingerprint,mode:mixed?'non-applicable-mixed-evidence-overlay':'executable-sql-source-projection',blockedManualWrappers:projection.records?.filter(r=>!r.executableTopicWrapper).length??0,runtimeExecuted:false,publicationApproved:false});
 }
 assert.equal(overlay.size,283);
 assert.equal(records.slice(3).reduce((sum,r)=>sum+r.blockedManualWrappers,0),10);
 const p3={status:'p3-source-rehearsal',baseline,executableProjectionTarget:baseline+24,reviewOverlayTarget:baseline+40,modules:records,projection:projectionFingerprint(overlay),changesWritten:0,runtimeExecuted:false,publicationApproved:false};
 const p4=[],related=new Map();
 for(const [suite,spec] of Object.entries(suites))for(const id of spec.topics){
  if(!related.has(id))related.set(id,[]);
  related.get(id).push(suite);
 }
 const p4Modules=modules.filter(m=>/^1[34]\./.test(m.id));assert.equal(p4Modules.length,8);
 for(const [i,m] of p4Modules.entries()){
  const virtualRead=p=>overlay.has(p)?overlay.get(p):read(p);
  const virtualExists=p=>overlay.has(p)||exists(p);
  const projection=projectPersistenceReview(m,catalog,virtualRead,virtualExists);
  assert.equal(projection.applicable,false);assert.equal(projection.publicationApproved,false);assert.equal(projection.writes.size,59);
  assert.equal(projection.records.length,8);
  for(const t of projection.records){
   assert.equal(t.executableTopicWrapper,false);assert.equal(t.manualRequired,true);
   const lesson=projection.writes.get('src/content/lessons/'+t.id+'.mdx');
   assert.match(lesson,/NOT PUBLISHED/);assert.doesNotMatch(lesson,/<LabGate\b/);
   assert.match(projection.writes.get('labs/persistence-'+t.id.replaceAll('.','-')+'/solution.test.mjs'),/throw Error\('BLOCKED/);
   if(/^14\.0[34]/.test(t.id))assert.ok(t.runtime.includes('two-authenticated-users'));
  }
  overlay=appendReviewProjection(overlay,projection.writes);
  p4.push({moduleId:m.id,projectedLessons:baseline+40+8*(i+1),sourceFingerprint:m.fingerprint,projectionFingerprint:projection.fingerprint,topics:projection.records.map(t=>({id:t.id,requiredRuntime:t.runtime,supplementalSuites:related.get(t.id)??[],topicQualification:false,publicationApproved:false})),blockedManualWrappers:8,applicable:false,runtimeExecuted:false,publicationApproved:false});
 }
 assert.equal(overlay.size,731);assert.equal(p4.flatMap(m=>m.topics).length,64);
 const ids=new Set(p4.flatMap(m=>m.topics.map(t=>t.id)));for(const id of related.keys())assert.ok(ids.has(id),'Unmapped supplemental topic '+id);
 return {...p3,p4:{status:'p4-source-only-review-overlay',baseline:baseline+40,reviewOverlayTarget:baseline+104,canonicalRoadmapTarget:490,predecessorFixturePresent:baseline===386,modules:p4,blockedManualWrappers:64,relatedTopicCount:related.size,projection:projectionFingerprint(overlay),changesWritten:0,runtimeExecuted:false,publicationApproved:false}};

}
