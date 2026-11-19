import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.01.08 Lab streaming upload: actual Node core module behavior",async()=>{
assert.deepEqual(await mod.digestUpload(['hello'],5),{bytes:5,sha256:'2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'});
await assert.rejects(mod.digestUpload(['hello'],4),/Upload too large/);
await assert.rejects(mod.digestUpload(['x'],-1),/Invalid byte limit/);
});
