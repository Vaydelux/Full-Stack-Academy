import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.04.05 Client code generation: real OpenAPI 3.1 contract",async()=>{
const {loadTaskSpec}=await import('../../../examples/task-contract/load-spec.mjs');
const document=await loadTaskSpec();
const source=mod.generateClient(document);
assert.match(source,/export function createClient/);assert.match(source,/listNotes/);
const {createClient}=await import('data:text/javascript,'+encodeURIComponent(source));
const seen=[];
const client=createClient({baseUrl:'http://127.0.0.1:3456',token:'demo-token',fetchImpl:async(url,options)=>{seen.push({url:String(url),options});return new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}});}});
assert.deepEqual(await client.getHealth(),{ok:true});
await client.listNotes();await client.createNote({title:'Sample'});
assert.equal(seen.length,3);assert.equal(seen[0].options.headers.authorization,undefined);
assert.equal(seen[1].options.headers.authorization,'Bearer demo-token');
assert.equal(seen[2].options.method,'POST');
assert.deepEqual(JSON.parse(seen[2].options.body),{title:'Sample'});
});
