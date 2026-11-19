import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.01.05 Variant patterns and class merging local fixture",()=>{
assert.match(mod.classes('danger','lg'),/bg-red-700/);assert.match(mod.classes('secondary','sm'),/px-3 py-1.5/);assert.notEqual(mod.classes('primary','sm'),mod.classes('danger','sm'));
});
