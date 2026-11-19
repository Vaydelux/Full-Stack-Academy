import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.05.01 Environment separation policy model",()=>{
assert.equal(mod.publicEnvCandidate('NEXT_PUBLIC_SITE_TITLE'),true);assert.equal(mod.publicEnvCandidate('NEXT_PUBLIC_SECRET_TOKEN'),false);assert.equal(mod.publicEnvCandidate('DATABASE_URL'),false);assert.equal(mod.publicEnvCandidate('NEXT_PUBLIC_API_KEY'),false);
});
