import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.03.06 ISR vs SSR vs static cache decision model",()=>{
assert.equal(mod.renderingStrategy('marketing'),'static');
assert.equal(mod.renderingStrategy('news'),'revalidated-public');
assert.equal(mod.renderingStrategy('profile'),'request-dynamic');
});
