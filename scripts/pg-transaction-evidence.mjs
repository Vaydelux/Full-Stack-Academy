import assert from 'node:assert/strict';
// Exact deterministic observations from the retained independent transaction exercises.
// A receipt is evidence of these cases only, not a proof of all isolation guarantees.
const observations=Object.freeze([
 {uncommittedInvisible:true,total:20},
 {distinctClaims:true,deadlockSqlstate:'40P01'},
 {stableSnapshot:true,visibleAfterCommit:true},
 {winningWrites:1,staleWrites:1},
 {rollback:true,replay:true,tenantIsolation:true},
 {inserted:1,rejectedDuplicate:1},
 {constraintSqlstate:'23514',noPartialCommit:true},
 {lostUpdateObserved:true,atomicIncrementCorrect:true},
]);
export function validateConcurrency(rows){
 assert.ok(Array.isArray(rows),'Independent transaction observations required');
 assert.deepEqual(rows,observations.map((value,i)=>({id:'12.03.0'+(i+1),observations:value,scope:'disposable-real-postgresql',publicationApproved:false})),'Independent transaction evidence missing, reordered or changed');
 return rows;
}
export function parseConcurrencyOutput(output,id){
 const parsed=JSON.parse(output);
 assert.equal(parsed.publicationApproved,false);
 assert.equal(parsed.manualReviewRequired,true);
 assert.equal(parsed.observations?.length,1);
 const row=parsed.observations[0];
 assert.equal(row.id,id);
 return row;
}
