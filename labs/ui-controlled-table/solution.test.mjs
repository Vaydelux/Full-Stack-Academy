import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.03.02 Controlled sorting filtering pagination data/UX contract",()=>{
assert.deepEqual(mod.selectPage(['Zebra','Alpha','Another'],'a',0,2),['Alpha','Another']);assert.deepEqual(mod.selectPage(['Zebra','Alpha','Another'],'a',1,2),['Zebra']);assert.throws(()=>mod.selectPage([], '',-1,2),RangeError);
});
