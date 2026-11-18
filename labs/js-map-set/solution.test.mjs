import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Map Set WeakMap WeakSet semantics and regression cases",async()=>{
  const a={tag:'web'},b={tag:'web'},c={tag:'api'};assert.deepEqual(solve([a,b,a,c]),{tags:['web','api'],counts:{web:2,api:1}});assert.throws(()=>solve([null]),TypeError);
});
