import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.01.03 Radix primitives local fixture",()=>{
assert.equal(mod.validDialog('Delete','This cannot be undone.'),true);assert.equal(mod.validDialog('','Description'),false);assert.equal(mod.validDialog('Title',' '),false);
});
