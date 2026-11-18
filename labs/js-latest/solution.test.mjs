import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Race conditions and latest result — deterministic async behavior",async()=>{
const latest=solve();let resolveOld;const old=latest(()=>new Promise(resolve=>{resolveOld=resolve;}));const now=latest(async()=>2);assert.deepEqual(await now,{accepted:true,value:2});resolveOld(1);assert.deepEqual(await old,{accepted:false,value:null});const another=solve();assert.deepEqual(await another(async()=>3),{accepted:true,value:3});
});
