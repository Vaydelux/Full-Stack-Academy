import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("DTOs vs domain types — validated runtime boundary",()=>{assert.deepEqual(solve({id:'p1',priceCents:1250,currency:'PHP'}),{id:'p1',price:12.5,currency:'PHP'});assert.equal(solve({id:'p1',priceCents:1.5,currency:'PHP'}),null);assert.equal(solve({id:'p1',priceCents:100,currency:'BTC'}),null);});
