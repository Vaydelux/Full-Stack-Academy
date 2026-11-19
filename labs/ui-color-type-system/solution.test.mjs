import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.04.02 Color and typography systems local QA contract",()=>{
assert.match(mod.typography('heading'),/text-2xl/);assert.match(mod.typography('body'),/leading-7/);assert.notEqual(mod.typography('caption'),mod.typography('heading'));
});
