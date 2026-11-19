import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.01.04 Fetch and AbortSignal: actual Node core module behavior",async()=>{
assert.deepEqual(await mod.fetchJson('https://example.test',{fetchImpl:async()=>new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}})}),{ok:true});
await assert.rejects(mod.fetchJson('https://example.test',{fetchImpl:async()=>new Response('oops',{status:503})}),/Upstream HTTP 503/);
await assert.rejects(mod.fetchJson('https://example.test',{fetchImpl:async()=>new Response('<html/>',{status:200,headers:{'content-type':'text/html'}})}),/Unexpected content type/);
});
