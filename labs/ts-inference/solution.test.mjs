import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Type inference and annotations — type contract and runtime boundary",()=>{assert.equal(solve('2.5'),2.5);assert.equal(solve('0'),0);assert.throws(()=>solve('oops'),TypeError);assert.throws(()=>solve(''),TypeError);});
