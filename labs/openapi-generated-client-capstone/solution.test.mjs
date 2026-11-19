import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.04.08 Lab generated client: real OpenAPI 3.1 contract",async()=>{
const document=await mod.loadTaskSpec();
assert.equal(document.openapi,'3.1.1');
const source=mod.generateClient(document);
const {createClient}=await import('data:text/javascript,'+encodeURIComponent(source));
const server=mod.createDemoServer({token:'integration-demo-token'});
await new Promise((ok,bad)=>{server.once('error',bad);server.listen(0,'127.0.0.1',ok);});
const baseUrl='http://127.0.0.1:'+server.address().port;
try{
 const client=createClient({baseUrl,token:'integration-demo-token'});
 assert.deepEqual(await client.getHealth(),{ok:true});
 assert.deepEqual(await client.listNotes(),{items:[]});
 const created=await client.createNote({title:'  OpenAPI Contract  '});assert.equal(created.title,'OpenAPI Contract');
 assert.deepEqual((await client.listNotes()).items,[created]);
 const unauthorized=createClient({baseUrl,token:'incorrect-token'});
 await assert.rejects(unauthorized.listNotes(),err=>err.status===401);
 await assert.rejects(client.createNote({title:'x'}),err=>err.status===422);
}finally{await new Promise((ok,bad)=>server.close(err=>err?bad(err):ok()));}
});
