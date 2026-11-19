import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.01.08 Lab component gallery local fixture",()=>{
assert.deepEqual(mod.gallery([{id:'a',enabled:true},{id:'b',enabled:false}]).map(x=>x.id),['a']);assert.throws(()=>mod.gallery([{id:'a',enabled:true},{id:'a',enabled:true}]),/Duplicate ID/);
});
