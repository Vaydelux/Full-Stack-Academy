import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Type-safe errors and Result patterns — validated runtime boundary",()=>{assert.deepEqual(solve(' ok '),{ok:true,value:'ok'});assert.deepEqual(solve(new TypeError('password=secret')),{ok:false,error:'invalid-type'});assert.deepEqual(solve({password:'secret'}),{ok:false,error:'invalid-input'});});
