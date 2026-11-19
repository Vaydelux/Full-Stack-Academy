import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.04.08 Lab annotated UX review local QA contract",()=>{
assert.deepEqual(mod.auditUX({keyboard:false,contrast:false,errors:true,mobile:true,stableLayout:true}),['keyboard','contrast']);assert.deepEqual(mod.auditUX({keyboard:true,contrast:true,errors:true,mobile:true,stableLayout:true}),[]);
});
