import test from 'node:test';
import assert from 'node:assert/strict';
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
