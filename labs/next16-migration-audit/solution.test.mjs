import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.05.07 Upgrade and migration checks offline boundary checks",()=>{
assert.deepEqual(mod.migrationFindings({middleware:true,syncParams:true,legacyCache:false}),['rename-to-proxy','await-request-apis']);assert.deepEqual(mod.migrationFindings({middleware:false,syncParams:false,legacyCache:true}),['review-cache-components-mode']);assert.deepEqual(mod.migrationFindings({middleware:false,syncParams:false,legacyCache:false}),[]);
});
