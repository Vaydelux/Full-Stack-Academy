import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Prototypes and classes semantics and regression cases",async()=>{
  assert.equal(solve([{price:2},{price:3}]),5);assert.throws(()=>solve([{price:-1}]),TypeError);const {Basket}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));const b=new Basket();b.add({price:4});assert.equal(b.total(),4);assert.throws(()=>b.snapshot().push(5),TypeError);
});
