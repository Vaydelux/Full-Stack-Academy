import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.01.06 Theme providers and contrast local fixture",()=>{
assert.ok(Math.abs(mod.ratio('#ffffff','#000000')-21)<.001);assert.equal(mod.ratio('#ffffff','#ffffff'),1);assert.throws(()=>mod.ratio('red','#000000'),/Invalid hex/);
});
