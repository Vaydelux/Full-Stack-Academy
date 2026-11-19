import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.05.05 Error tracking offline boundary checks",()=>{
const row={requestId:'r1',operation:'course.read',errorCode:'DB_TIMEOUT',token:'SECRET',email:'user@example.test'};assert.deepEqual(mod.sanitizeError(row),{requestId:'r1',operation:'course.read',errorCode:'DB_TIMEOUT'});assert.doesNotMatch(JSON.stringify(mod.sanitizeError(row)),/SECRET|user@example/);
});
