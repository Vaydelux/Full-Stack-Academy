import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Compile-time types vs runtime values — validated runtime boundary",()=>{assert.equal(solve({priceCents:250}),'250');assert.equal(solve({}),'INVALID');assert.equal(solve({priceCents:NaN}),'INVALID');assert.equal(solve(null),'INVALID');});
