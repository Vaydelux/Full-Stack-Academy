import test from 'node:test';
import assert from 'node:assert/strict';
const target = process.env.ACADEMY_LAB_TARGET === 'starter' ? 'starter' : 'solution';
const api = await import(`./${target}/exercise.mjs`);
test('classifies HTTP 404 and measures a deterministic duration',async()=>{
 let t=0;const result=await api.probeRequest(async()=>{t+=17;return new Response('missing',{status:404,headers:{'Content-Type':'text/plain'}});},()=>t);
 assert.deepEqual(result,{kind:'http',status:404,ok:false,durationMs:17,contentType:'text/plain'});
});
test('classifies thrown network error separately',async()=>{
 let t=0;const result=await api.probeRequest(async()=>{t+=5;throw new Error('failed')},()=>t);
 assert.deepEqual(result,{kind:'network-error',status:null,ok:false,durationMs:5,contentType:null});
});
test('does not leak a response body or authorization token',async()=>{
 const response=new Response('SECRET_CONTENT',{headers:{Authorization:'Bearer SECRET_TOKEN'}});
 const result=await api.probeRequest(async()=>response,()=>1);
 assert.equal(result.status,200);
 assert.doesNotMatch(JSON.stringify(result),/SECRET_CONTENT|SECRET_TOKEN/);
});
