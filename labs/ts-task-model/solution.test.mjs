import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Lab typed task model — type contract and runtime boundary",()=>{assert.deepEqual(solve({id:'t1',title:'Plan',minutes:30,status:'todo'}),{id:'t1',title:'Plan',minutes:30,status:'todo'});assert.equal(solve({id:'t2',title:'Bad',minutes:-1,status:'todo'}),null);assert.equal(solve({id:'t3',title:'Bad',minutes:3,status:'unknown'}),null);assert.equal(solve(null),null);});
