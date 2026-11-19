import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.01.06 Memory and CPU profiling: actual Node core module behavior",async()=>{
const m=mod.sampleRuntime();
assert.ok(Number.isFinite(m.rss)&&m.rss>0);
assert.ok(Number.isFinite(m.heapUsed)&&m.heapUsed>0);
assert.ok(Number.isFinite(m.userCpuMicros)&&m.userCpuMicros>=0);
assert.ok(m.rss>=m.heapUsed);
});
