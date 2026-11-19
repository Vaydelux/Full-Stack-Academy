import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.03.04 Dense tables and mobile alternatives data/UX contract",()=>{
assert.equal(mod.layoutFor(320,8),'cards');assert.equal(mod.layoutFor(1024,8),'table');assert.equal(mod.layoutFor(320,2),'table');assert.throws(()=>mod.layoutFor(0,8),RangeError);
});
