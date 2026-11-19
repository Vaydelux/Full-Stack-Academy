import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.03.04 Revalidation and invalidation cache decision model",()=>{
assert.equal(mod.invalidationMode(false),'swr');
assert.equal(mod.invalidationMode(true),'read-your-writes');
});
