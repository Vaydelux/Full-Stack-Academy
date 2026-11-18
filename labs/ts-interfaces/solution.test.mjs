import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Interfaces vs type aliases — type contract and runtime boundary",()=>{assert.deepEqual(solve({id:'x',displayName:'Ada',role:'editor'}),{label:'Ada',role:'editor'});assert.deepEqual(solve({id:'y',role:'reader'}),{label:'y',role:'reader'});assert.throws(()=>solve({id:'z',role:'root'}),TypeError);});
