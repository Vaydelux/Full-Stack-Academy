import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.01.04 shadcn composition local fixture",()=>{
assert.equal(mod.packageFor('base-ui'),'@base-ui/react');assert.equal(mod.packageFor('radix'),'radix-ui');
});
