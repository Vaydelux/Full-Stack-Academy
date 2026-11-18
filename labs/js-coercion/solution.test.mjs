import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Primitive types and coercion — observed input/output contract",()=>{
  assert.deepEqual(solve(' 42 '),{ok:true,value:42});
  assert.deepEqual(solve(''),{ok:false,reason:'empty-or-not-text'});
  assert.deepEqual(solve('nope'),{ok:false,reason:'not-finite'});
  assert.deepEqual(solve('0'),{ok:true,value:0});
});
