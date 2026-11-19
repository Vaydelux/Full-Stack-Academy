import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.04.07 CLS and layout stability local QA contract",()=>{
assert.equal(mod.reservedHeight(720,1440,900),450);assert.equal(mod.reservedHeight(320,640,480),240);assert.throws(()=>mod.reservedHeight(320,0,480),RangeError);
});
