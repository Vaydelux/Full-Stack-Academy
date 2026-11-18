import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Lab resilient fetch client — deterministic async behavior",async()=>{
let attempts=0;assert.equal(await solve(async()=>{attempts++;return attempts===1?{ok:false,status:503}:{ok:true,data:'fresh'};}),'fresh');assert.equal(attempts,2);let denied=0;await assert.rejects(()=>solve(async()=>{denied++;return {ok:false,status:403};}),/HTTP 403/);assert.equal(denied,1);await assert.rejects(()=>solve(()=>new Promise(()=>{}),{attempts:1,timeoutMs:10}),/timeout/);const abort=new AbortController();abort.abort(new Error('stop'));await assert.rejects(()=>solve(async()=>({ok:true,data:1}),{signal:abort.signal}),/stop/);
});
