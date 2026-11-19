import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.03.05 Request body and file limits: security boundary",async()=>{
assert.equal((await mod.readBounded([Buffer.from('€')],3,3)).toString('utf8'),'€');
await assert.rejects(mod.readBounded([Buffer.from('€')],2,3),/Declared body too large/);
await assert.rejects(mod.readBounded([Buffer.from('€')],2),/Body too large/);
await assert.rejects(mod.readBounded([Buffer.from('a')],10,2),/Mismatched length/);
});
