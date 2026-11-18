import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Error handling boundaries semantics and regression cases",async()=>{
  assert.deepEqual(solve('{"name":"Ada"}'),{ok:true,value:{name:'Ada'}});assert.deepEqual(solve('{'),{ok:false,error:'invalid-json'});assert.deepEqual(solve('[]'),{ok:false,error:'invalid-shape'});assert.deepEqual(solve(null),{ok:false,error:'not-text'});
});
