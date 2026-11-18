import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Serialization boundaries and dates — validated runtime boundary",()=>{assert.equal(solve({createdAt:'2026-11-19T01:00:00.000Z'}),'2026-11-19T01:00:00.000Z');assert.equal(solve({createdAt:'not-a-date'}),null);assert.equal(solve(null),null);});
