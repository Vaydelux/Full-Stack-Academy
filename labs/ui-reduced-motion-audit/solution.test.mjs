import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.04.05 Reduced motion testing local QA contract",()=>{
assert.deepEqual(mod.motionAudit(true),{parallax:false,focusVisible:true});assert.deepEqual(mod.motionAudit(false),{parallax:true,focusVisible:true});
});
