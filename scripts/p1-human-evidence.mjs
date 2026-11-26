import assert from 'node:assert/strict';
const modules=['09.02','09.03'];
const checks=['keyboard','zoom200','screenReader','topicSpecific'];
const placeholder=/\b(?:todo|pending|placeholder|example|unknown|not[ -]run|unapproved|synthetic|fixture|dummy|tbd|n\/a)\b/i;
const actual=(value,min=3)=>typeof value==='string'&&value.trim().length>=min&&value.length<=4000&&!placeholder.test(value);
export function validateP1HumanEvidence(e,{moduleId,sourceSha256,today=new Date().toISOString().slice(0,10)}){
 assert.ok(modules.includes(moduleId),'Unsupported P1 module');
 assert.equal(e.moduleId,moduleId);assert.match(sourceSha256,/^[a-f0-9]{64}$/);assert.ok(e.sourceSha256===sourceSha256,'Human review is stale');
 for(const key of ['reviewed','keyboard','zoom200'])assert.equal(e[key],true,'Missing actual '+key+' review');
 for(const key of ['reviewer','screenReader','browser','operatingSystem'])assert.ok(actual(e[key]),'Missing actual '+key);
 assert.match(e.date,/^\d{4}-\d{2}-\d{2}$/);assert.ok(new Date(e.date).toISOString().slice(0,10)===e.date&&e.date>='2026-11-25'&&e.date<=today,'Invalid review date');
 const ids=Array.from({length:8},(_,i)=>moduleId+'.0'+(i+1));
 assert.deepEqual(e.lessonIds,ids,'Expected exact canonical lesson IDs');
 assert.ok(Array.isArray(e.observations),'Per-lesson review observations required');
 assert.deepEqual(e.observations.map(o=>o.id),ids,'Expected exact canonical observations');
 for(const row of e.observations){for(const key of checks)assert.ok(actual(row[key],20),'Missing actual '+key+' observation for '+row.id);assert.equal(row.passed,true,'Unresolved review failure for '+row.id);}
 return e;
}
