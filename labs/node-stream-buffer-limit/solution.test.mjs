import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.01.03 Node streams and buffers: actual Node core module behavior",async()=>{
assert.deepEqual(await mod.collectBytes(['€'],3),{size:3,content:'€'});
assert.deepEqual(await mod.collectBytes(['ab','cd'],4),{size:4,content:'abcd'});
await assert.rejects(mod.collectBytes(['€'],2),/Body too large/);
await assert.rejects(mod.collectBytes(['x'],-1),/Invalid byte limit/);
});
