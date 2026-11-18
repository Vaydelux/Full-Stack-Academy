import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Bug Hunt unsafe type assertions — type-safe runtime semantics",async()=>{assert.deepEqual(solve({email:'ADA@Example.com'}),{ok:true,email:'ada@example.com'});assert.deepEqual(solve({}),{ok:false,error:'missing-email'});assert.deepEqual(solve({email:'invalid'}),{ok:false,error:'invalid-email'});assert.deepEqual(solve(null),{ok:false,error:'missing-email'});});
