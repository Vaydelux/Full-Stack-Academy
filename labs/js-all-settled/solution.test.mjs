import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Promise.all and allSettled — deterministic async behavior",async()=>{
const tasks=[async()=>1,async()=>{throw new Error('nope');},async()=>3];assert.deepEqual(await solve(tasks),{values:[1,3],errors:['nope']});assert.deepEqual(await solve([]),{values:[],errors:[]});await assert.rejects(()=>solve([null]),TypeError);
});
