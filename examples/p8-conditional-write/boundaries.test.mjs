import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {request} from 'node:http';
import {createTaskServer} from './server.mjs';

async function fixture(t, options){
 const server=createTaskServer(options);server.listen(0,'127.0.0.1');await once(server,'listening');
 t.after(()=>{server.closeAllConnections();return new Promise(resolve=>server.close(resolve));});
 const url=`http://127.0.0.1:${server.address().port}/task`;
 const patch=(body,headers={})=>fetch(url,{method:'PATCH',headers:{'content-type':'application/json','if-match':'"1"',...headers},body,signal:AbortSignal.timeout(2000)});
 const unchanged=async()=>assert.deepEqual(await (await fetch(url)).json(),{id:1,title:'Review lesson',done:false,revision:1});
 return {url,patch,unchanged};
}
function partial(url,headers,chunk){
 return new Promise((resolve,reject)=>{
  const req=request(url,{method:'PATCH',headers:{'content-type':'application/json','if-match':'"1"',...headers}},res=>{
   const parts=[];res.on('data',c=>parts.push(c));res.on('error',reject);res.on('end',()=>{resolve({status:res.statusCode,headers:res.headers,body:JSON.parse(Buffer.concat(parts))});req.destroy();});
  });
  req.on('error',reject);req.setTimeout(1200,()=>req.destroy(new Error('No bounded response')));req.write(chunk);
 });
}
test('accepts case-insensitive JSON media type with UTF-8 parameter',async t=>{const f=await fixture(t);assert.equal((await f.patch('{"done":true}',{'content-type':'Application/JSON; charset=utf-8'})).status,200);});
test('rejects unsupported content encoding without mutation',async t=>{const f=await fixture(t);assert.equal((await f.patch('{"done":true}',{'content-encoding':'gzip'})).status,415);await f.unchanged();});
test('rejects invalid UTF-8 JSON without mutation',async t=>{const f=await fixture(t);assert.equal((await f.patch(Buffer.from([123,34,0xc3,0x28,34,58,116,114,117,101,125]))).status,400);await f.unchanged();});
test('rejects cross-origin and cross-site requests',async t=>{const f=await fixture(t);assert.equal((await f.patch('{"done":true}',{origin:'https://example.invalid'})).status,403);assert.equal((await f.patch('{"done":true}',{'sec-fetch-site':'cross-site'})).status,403);await f.unchanged();});
test('rejects spoofed Host before serving data',async t=>{const f=await fixture(t);const status=await new Promise((resolve,reject)=>{const req=request(f.url,{headers:{host:'example.invalid'}},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});req.on('error',reject);req.end();});assert.equal(status,421);await f.unchanged();});
test('declared oversized body gets early 413 before upload completes',async t=>{const f=await fixture(t);const res=await partial(f.url,{'content-length':'2048'},'{');assert.equal(res.status,413);assert.equal(res.headers.connection,'close');await f.unchanged();});
test('oversized chunked body gets early 413 before upload completes',async t=>{const f=await fixture(t);const res=await partial(f.url,{'transfer-encoding':'chunked'},Buffer.alloc(1025,97));assert.equal(res.status,413);await f.unchanged();});
test('incomplete body receives bounded 408 and cannot change the task',async t=>{const f=await fixture(t,{bodyTimeoutMs:200});const res=await partial(f.url,{'content-length':'13'},'{');assert.equal(res.status,408);assert.equal(res.headers.connection,'close');await f.unchanged();});
test('invalid body timeout configuration fails closed',()=>{for(const bodyTimeoutMs of [0,-1,NaN,1.5,60001])assert.throws(()=>createTaskServer({bodyTimeoutMs}),/body timeout/i);});
