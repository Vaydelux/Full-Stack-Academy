import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Lab schema-first API data — validated runtime boundary",()=>{assert.deepEqual(solve({sku:'SKU-1',qty:3}),{ok:true,data:{sku:'SKU-1',qty:3}});assert.deepEqual(solve({sku:'SKU-1',qty:-1}),{ok:false,error:'invalid-body'});assert.deepEqual(solve({sku:'SKU-1',qty:3,admin:true}),{ok:false,error:'invalid-body'});assert.deepEqual(solve(null),{ok:false,error:'invalid-body'});});
