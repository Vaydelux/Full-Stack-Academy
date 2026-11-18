import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Call stack and event loop — deterministic async behavior",async()=>{
assert.deepEqual(await solve(),['sync','end-sync','promise','timer']);
});
