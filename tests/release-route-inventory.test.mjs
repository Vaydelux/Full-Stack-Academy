import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildRouteInventory,verifyRouteInventory} from '../scripts/release-route-inventory.mjs';
const paths=buildRouteInventory([{id:'09.02.01'}],[{id:'web-fetch'}]);
const html=()=>new Response('<main id="doc-main"><h1>Topic</h1></main>',{headers:{'content-type':'text/html'}});
test('canonical inventory includes both namespaces and rejects duplicates and unsafe IDs',()=>{
 assert.deepEqual(paths,['/learn/09.02.01','/reference/web-fetch']);
 assert.throws(()=>buildRouteInventory([{id:'../x'}],[{id:'web-fetch'}]));
 assert.throws(()=>buildRouteInventory([{id:'09.02.01'},{id:'09.02.01'}],[{id:'web-fetch'}]));
});
test('all documents must succeed without redirects',async()=>{
 const result=await verifyRouteInventory('http://127.0.0.1:3000',paths,async(url,opts)=>{assert.equal(opts.redirect,'manual');return html();});
 assert.equal(result.passed,true);assert.equal(result.checked,2);
});
test('redirects, missing shell, wrong media and request errors fail',async()=>{
 for(const request of [async()=>new Response('',{status:302}),async()=>new Response('<h1>Missing</h1>',{headers:{'content-type':'text/html'}}),async()=>new Response('id="doc-main"<h1>'),async()=>{throw Error('offline');}]){
 const result=await verifyRouteInventory('http://127.0.0.1:3000',paths,request);assert.equal(result.passed,false);assert.equal(result.failures.length,2);
 }
 await assert.rejects(()=>verifyRouteInventory('https://example.org',paths));
});

test('real committed catalog and reference index pass the inventory guard',()=>{
 const read = name => JSON.parse(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
 const lessons=read('curriculum.json').lessons, references=read('reference-index.json').entries;
 const inventory=buildRouteInventory(lessons,references);
 assert.equal(inventory.length,lessons.length+references.length);
 assert.ok(inventory.includes('/reference/next.js-page-tsx'));
});
test('dotted canonical references pass both guards; unsafe paths never reach fetch',async()=>{
 const inventory=buildRouteInventory([{id:'09.02.01'}],[{id:'next.js-page-tsx'}]);
 assert.equal((await verifyRouteInventory('http://127.0.0.1:3000',inventory,async()=>html())).passed,true);
 for(const id of ['..','a..b','a/b','a%2fb','a?b','a#b','a\n','a.-b','a-','-a','a\\b']){
  assert.throws(()=>buildRouteInventory([{id:'09.02.01'}],[{id}]));
  let calls=0;
  const outcome=await verifyRouteInventory('http://127.0.0.1:3000',['/reference/'+id],async()=>{calls++;return html();});
  assert.equal(calls,0);assert.equal(outcome.passed,false);
 }
 assert.throws(()=>buildRouteInventory([{id:'09.02.01\n'}],[{id:'web-fetch'}]));
});
