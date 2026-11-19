import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.03.07 Export and print UX data/UX contract",()=>{
assert.equal(mod.csvCell('A,B'),'"A,B"');assert.equal(mod.csvCell('"Hi"'),'"\u0022\u0022Hi\u0022\u0022"');assert.equal(mod.csvCell('=2+2'),"'=2+2");assert.equal(mod.csvCell('normal'),'normal');
});
