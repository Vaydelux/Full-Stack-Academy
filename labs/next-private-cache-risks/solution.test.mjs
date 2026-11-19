import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.03.05 Private data and cache risks cache decision model",()=>{
assert.equal(mod.mayUseSharedCache('public'),true);
assert.equal(mod.mayUseSharedCache('organization'),false);
assert.equal(mod.mayUseSharedCache('private'),false);
});
