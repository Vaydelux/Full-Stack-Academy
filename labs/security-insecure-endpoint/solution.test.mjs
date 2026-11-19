import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.03.08 Bug Hunt: insecure endpoint: security boundary",async()=>{
const server=mod.createDemoServer({token:'test-token'});
await new Promise((ok,bad)=>{server.once('error',bad);server.listen(0,'127.0.0.1',ok);});
const base='http://127.0.0.1:'+server.address().port;
try{
 const denied=await fetch(base+'/api/notes');assert.equal(denied.status,401);
 assert.doesNotMatch(await denied.text(),/test-token|private/);
 const denied2=await fetch(base+'/api/notes',{headers:{authorization:'Bearer wrong'}});assert.equal(denied2.status,401);
 const body=JSON.stringify({title:'  Secure APIs  '});
 const created=await fetch(base+'/api/notes',{method:'POST',headers:{authorization:'Bearer test-token','content-type':'application/json'},body});
 assert.equal(created.status,201);assert.equal((await created.json()).title,'Secure APIs');
 const listing=await fetch(base+'/api/notes',{headers:{authorization:'Bearer test-token'}});
 assert.equal(listing.status,200);assert.equal((await listing.json()).items.length,1);
 const large=await fetch(base+'/api/notes',{method:'POST',headers:{authorization:'Bearer test-token','content-type':'application/json'},body:JSON.stringify({title:'x'.repeat(4000)})});
 assert.equal(large.status,413);
}finally{await new Promise((ok,bad)=>server.close(err=>err?bad(err):ok()));}
});
