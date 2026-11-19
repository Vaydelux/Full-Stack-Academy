import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.02.04 Idempotency and retries: HTTP contract acceptance",async()=>{
let calls=0;
const invoke=mod.makeIdempotent(async payload=>{calls++;await Promise.resolve();return {id:'task-1',payload};});
const [a,b]=await Promise.all([invoke('same',{title:'One'}),invoke('same',{title:'One'})]);
assert.deepEqual(a,b);assert.equal(calls,1);
assert.deepEqual(await invoke('same',{title:'Two'}),{status:409,conflict:true});
assert.equal(calls,1);
});
