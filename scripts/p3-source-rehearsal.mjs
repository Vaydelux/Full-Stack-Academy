/** Read-only chained P3 source projection from the qualified P1/P2 review fixture. */
import assert from 'node:assert/strict';
import {buildPersistencePlan} from './persistence-release-plan.mjs';
import {projectSqlModule} from './f9-publication.mjs';
import {projectPersistenceReview} from './persistence-review-projection.mjs';
import {projectionFingerprint} from './forms-query-projection-integrity.mjs';
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
 const modules=buildPersistencePlan(catalog,read).modules;
 let overlay=new Map(),records=[];
 for(const [i,id] of ['12.01','12.02','12.03','12.04','12.05'].entries()){
  assert.ok(!checkpoint.snapshot.completeModules.includes(id));
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
  records.push({moduleId:id,projectedLessons:386+8*(i+1),sourceFingerprint:m.fingerprint,projectionFingerprint:projection.fingerprint,mode:mixed?'non-applicable-mixed-evidence-overlay':'executable-sql-source-projection',blockedManualWrappers:projection.records?.filter(r=>!r.executableTopicWrapper).length??0,runtimeExecuted:false,publicationApproved:false});
 }
 assert.equal(overlay.size,283);
 assert.equal(records.slice(3).reduce((sum,r)=>sum+r.blockedManualWrappers,0),10);
 return {status:'p3-source-rehearsal',baseline:386,executableProjectionTarget:410,reviewOverlayTarget:426,modules:records,projection:projectionFingerprint(overlay),changesWritten:0,runtimeExecuted:false,publicationApproved:false};
}
