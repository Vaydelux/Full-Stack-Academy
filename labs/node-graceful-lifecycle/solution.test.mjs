import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.01.07 Process lifecycle: actual Node core module behavior",async()=>{
const {EventEmitter}=await import('node:events');
const signals=new EventEmitter();let calls=0;
const dispose=mod.installShutdown(signals,()=>{calls++;});
signals.emit('SIGTERM');signals.emit('SIGINT');
await new Promise(resolve=>setImmediate(resolve));
assert.equal(calls,1);
dispose();assert.equal(signals.listenerCount('SIGTERM'),0);assert.equal(signals.listenerCount('SIGINT'),0);
});
