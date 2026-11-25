import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

export const NEST_MODULES=['11.01','11.02','11.03','11.04'];
export const evidencePath=id=>'docs/release-evidence/nestjs-'+id+'-accessibility.json';
export function nestPromotionOrder(snapshot,id){
 const index=NEST_MODULES.indexOf(id);
 assert.ok(index>=0,'Unknown Nest module');
 const done=new Set(snapshot.completeModules);
 assert.ok(done.has('09.02')&&done.has('09.03'),'Complete both P1 modules first');
 assert.deepEqual(NEST_MODULES.filter(m=>done.has(m)),NEST_MODULES.slice(0,index),'Nest modules must publish in canonical order');
 assert.equal(snapshot.publishedLessons,354+index*8,'Unexpected published baseline');
 return {before:snapshot.publishedLessons,target:snapshot.publishedLessons+8};
}
// Bind the entire tracked input tree, except this module's human evidence file.
// The clean checkout requirement ensures the index represents the actual source.
export function nestReviewFingerprint(index,projectionSha,id){
 assert.ok(NEST_MODULES.includes(id));assert.match(projectionSha,/^[a-f0-9]{64}$/);
 const rows=index.split('\0').filter(Boolean).map(row=>{
  const m=/^(100644|100755|120000) ([a-f0-9]{40}) 0\t([^\0]+)$/.exec(row);
  assert.ok(m,'Unsupported or unmerged Git index entry');return [m[3],m[1],m[2]];
 }).filter(([file])=>file!==evidencePath(id)).sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
 assert.ok(rows.length>0,'Empty tracked review input');
 return createHash('sha256').update(JSON.stringify({id,projectionSha,rows})).digest('hex');
}
export function validateNestReview(evidence,{id,fingerprint,lessonIds,today}){
 assert.equal(evidence.moduleId,id);assert.equal(evidence.sourceSha256,fingerprint);assert.match(fingerprint,/^[a-f0-9]{64}$/);
 for(const key of ['reviewed','keyboard','zoom200','screenReaderPassed'])assert.equal(evidence[key],true,'Missing actual '+key+' review');
 for(const key of ['reviewer','screenReader','browser','operatingSystem','notes']){
  const value=evidence[key];assert.ok(typeof value==='string'&&value.trim().length>=3&&!/^(?:example|placeholder|unknown|n\/a|todo|test reviewer)$/i.test(value.trim()),'Missing real '+key);
 }
 assert.match(evidence.date,/^\d{4}-\d{2}-\d{2}$/);
 const time=Date.parse(evidence.date+'T00:00:00Z');
 assert.ok(Number.isFinite(time)&&new Date(time).toISOString().slice(0,10)===evidence.date&&evidence.date<=today&&evidence.date>='2026-11-25','Invalid review date');
 assert.deepEqual([...evidence.lessonIds].sort(),[...lessonIds].sort());
 return evidence;
}
/** Restore exact preimages on any thrown write or postflight failure. Never delete unrelated paths. */
export function applyNestTransaction(writes,io,postflight){
 const before=new Map([...writes.keys()].map(file=>[file,io.exists(file)?io.read(file):null]));
 const attempted=[];
 try{
  for(const [file,value] of writes){attempted.push(file);io.write(file,value);}
  postflight();
 }catch(error){
  const failures=[];
  for(const file of attempted.reverse())try{const original=before.get(file);if(original===null)io.remove(file);else io.write(file,original);}catch(e){failures.push(e);}
  if(failures.length)throw new AggregateError([error,...failures],'Publication failed and rollback was incomplete; inspect worktree');
  throw error;
 }
}
