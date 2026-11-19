import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.01.02 CSS-first tokens local fixture",()=>{
assert.equal(mod.tokenFor('success'),'var(--color-success)');assert.equal(mod.tokenFor('warning'),'var(--color-warning)');assert.equal(mod.tokenFor('danger'),'var(--color-danger)');
});
