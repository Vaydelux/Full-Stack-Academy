import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Utility types and public projections — type-safe runtime semantics",async()=>{const x=solve({id:'u',name:'Ada',secret:'hidden'});assert.deepEqual(x,{id:'u',name:'Ada'});assert.equal('secret' in x,false);});
