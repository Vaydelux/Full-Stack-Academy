import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Modules and exports semantics and regression cases",async()=>{
  assert.equal(solve('  Web APIs  '),'web-apis');assert.equal(solve(' TYPESCRIPT '),'typescript');assert.throws(()=>solve(''),TypeError);
});
