import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.03.01 Fetch behavior in Next.js 16 cache decision model",()=>{
assert.equal(mod.sharedCacheCandidate('catalogue'),true);
assert.equal(mod.sharedCacheCandidate('inbox'),false);
assert.equal(mod.sharedCacheCandidate('account'),false);
});
