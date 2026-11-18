import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Union intersection and literal types — type contract and runtime boundary",()=>{assert.equal(solve({id:'u1',tier:'pro'}),'pro:u1');assert.equal(solve({id:'u2',tier:'basic'}),'basic:u2');assert.throws(()=>solve({id:'u3',tier:'other'}),TypeError);});
