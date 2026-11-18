import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Fetch timeouts and retries — deterministic async behavior",async()=>{
let calls=0;const result=await solve(async()=>{calls++;return calls<3?{ok:false,status:503}:{ok:true,data:'done'};});assert.equal(result,'done');assert.equal(calls,3);let refused=0;await assert.rejects(()=>solve(async()=>{refused++;return {ok:false,status:404};}),/HTTP 404/);assert.equal(refused,1);await assert.rejects(()=>solve(async()=>{throw new Error('offline');},{attempts:2}),/offline/);
});
