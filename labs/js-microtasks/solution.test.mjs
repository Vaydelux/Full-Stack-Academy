import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Microtasks and macrotasks — deterministic async behavior",async()=>{
assert.deepEqual(await solve(),['sync','queueMicrotask','promise','timer']);
});
