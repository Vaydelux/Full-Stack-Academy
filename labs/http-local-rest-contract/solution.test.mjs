import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.02.08 Lab REST contract: HTTP contract acceptance",async()=>{
const server=mod.buildServer();
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
const addr=server.address();
const base='http://127.0.0.1:'+addr.port;
try{
 const notFound=await fetch(base+'/missing');
 assert.equal(notFound.status,404);
 assert.match(notFound.headers.get('content-type')??'',/problem\+json/);
 const unsupported=await fetch(base+'/api/tasks',{method:'PATCH'});
 assert.equal(unsupported.status,405);
 assert.match(unsupported.headers.get('allow')??'',/GET, POST/);
 const wrongType=await fetch(base+'/api/tasks',{method:'POST',headers:{'idempotency-key':'k1','content-type':'text/plain'},body:'wrong'});
 assert.equal(wrongType.status,415);
 const bad=await fetch(base+'/api/tasks',{method:'POST',headers:{'idempotency-key':'k2','content-type':'application/json'},body:JSON.stringify({title:'x',status:'open'})});
 assert.equal(bad.status,422);
 const opts={method:'POST',headers:{'idempotency-key':'task-one','content-type':'application/json'},body:JSON.stringify({title:'Learn HTTP',status:'open'})};
 const created=await fetch(base+'/api/tasks',opts);assert.equal(created.status,201);
 const first=await created.json();assert.equal(first.title,'Learn HTTP');
 const replay=await fetch(base+'/api/tasks',opts);assert.equal(replay.status,201);
 assert.equal((await replay.json()).id,first.id);
 const conflict=await fetch(base+'/api/tasks',{...opts,body:JSON.stringify({title:'Different task',status:'open'})});
 assert.equal(conflict.status,409);
 const result=await fetch(base+'/api/tasks?status=open&limit=1');assert.equal(result.status,200);
 assert.equal((await result.json()).total,1);
 const tag=result.headers.get('etag');assert.ok(tag);
 const cached=await fetch(base+'/api/tasks?status=open&limit=1',{headers:{'if-none-match':tag}});
 assert.equal(cached.status,304);assert.equal(await cached.text(),'');
}finally{await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));}
});
