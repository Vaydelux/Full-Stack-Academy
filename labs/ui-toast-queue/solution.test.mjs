import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.02.05 Toasts and announcements offline model",()=>{
const once=mod.queueToast([],{id:'save',message:'Saved'});const twice=mod.queueToast(once,{id:'save',message:'Updated'});assert.deepEqual(twice,[{id:'save',message:'Updated'}]);assert.equal(once.length,1);
});
