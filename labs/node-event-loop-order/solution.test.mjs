import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.01.01 Event loop, I/O and worker threads: actual Node core module behavior",async()=>{
assert.deepEqual(await mod.eventOrder(),['sync','microtask','immediate']);
});
