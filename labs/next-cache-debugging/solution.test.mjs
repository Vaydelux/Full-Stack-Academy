import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.03.07 Cache debugging cache decision model",()=>{
assert.equal(mod.cacheDiagnosis('private','courses:x'),'unsafe-shared-scope');
assert.equal(mod.cacheDiagnosis('public',''),'missing-or-invalid-tag');
assert.equal(mod.cacheDiagnosis('public','courses:react'),'healthy');
});
