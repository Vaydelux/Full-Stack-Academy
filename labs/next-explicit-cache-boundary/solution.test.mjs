import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.03.02 Explicit cache boundaries cache decision model",()=>{
assert.equal(mod.cacheScope('public'),'shared');
assert.equal(mod.cacheScope('personalized'),'request');
});
