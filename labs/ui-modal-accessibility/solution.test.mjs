import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.02.02 Accessible modal dialog offline model",()=>{
assert.deepEqual(mod.modalPlan('Delete','Cancel'),{accessible:true,initialFocus:'cancel'});assert.equal(mod.modalPlan('','Cancel').accessible,false);
});
