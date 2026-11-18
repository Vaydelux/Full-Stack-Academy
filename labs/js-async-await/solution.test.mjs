import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Promises and async await — deterministic async behavior",async()=>{
assert.deepEqual(await solve(async()=>42),{ok:true,value:42});assert.deepEqual(await solve(async()=>{throw new Error('offline');}),{ok:false,error:'offline'});await assert.rejects(()=>solve(null),TypeError);
});
