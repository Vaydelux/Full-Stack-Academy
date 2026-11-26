import test from 'node:test';
import assert from 'node:assert/strict';
import {publicOrigin,readStoredProgress,backupWithinLimit,previewDiagnostic} from '../src/lib/academy/runtime-boundaries.mjs';
test('public canonical origin rejects malformed, credentialed, local and non-origin URLs',()=>{
 for(const url of ['http://example.org','https:example.org','https://user:pass@example.org','https://localhost','https://127.0.0.1','https://[::1]','https://example.org/a','https://example.org/?a=1','https://example.org/#x','https://example.org:99999'])assert.equal(publicOrigin(url),undefined,url);
 assert.equal(publicOrigin('https://academy.example.org/'),'https://academy.example.org');
});
test('missing storage is distinct from corrupt or inaccessible storage',()=>{
 const empty={notes:{}},decode=raw=>JSON.parse(raw);
 assert.deepEqual(readStoredProgress(()=>null,decode,empty),{ok:true,data:empty});
 assert.deepEqual(readStoredProgress(()=>'{broken',decode,empty),{ok:false});
 assert.deepEqual(readStoredProgress(()=>{throw Error('denied')},decode,empty),{ok:false});
 assert.deepEqual(readStoredProgress(()=>'{}',()=>undefined,empty),{ok:false});
 assert.deepEqual(readStoredProgress(()=>'{"notes":{"a":"keep"}}',decode,empty),{ok:true,data:{notes:{a:'keep'}}});
});
test('backup limit counts UTF-8 bytes, not code units',()=>{
 assert.equal(backupWithinLimit('a'.repeat(2_000_000)),true);
 assert.equal(backupWithinLimit('é'.repeat(1_000_001)),false);
 assert.equal(backupWithinLimit('a'.repeat(2_000_001)),false);
 assert.equal(backupWithinLimit(null),false);
});
const msg=value=>({source:'academy-preview',...value});
test('unrecognized or malformed diagnostic messages cannot update host status',()=>{
 for(const v of [null,{},msg({type:'STATUS',status:'unknown'}),msg({type:'CONSOLE',level:'bogus',text:'hi'}),msg({type:'STATE',hooks:[],renders:-1}),msg({type:'STATE',hooks:[],renders:Infinity})])assert.equal(previewDiagnostic(v),null);
 assert.deepEqual(previewDiagnostic(msg({type:'READY'})),{type:'READY'});
 assert.deepEqual(previewDiagnostic(msg({type:'STATUS',status:'ok'})),{type:'STATUS',status:'ok'});
});
test('sandbox diagnostics cap console and error text, hooks and render counts',()=>{
 assert.equal(previewDiagnostic(msg({type:'CONSOLE',level:'info',text:'x'.repeat(6000)})).text.length,4096);
 assert.equal(previewDiagnostic(msg({type:'STATUS',status:'error',message:'x'.repeat(6000)})).message.length,4096);
 const x=previewDiagnostic(msg({type:'STATE',hooks:Array(40).fill('x'.repeat(1000)),renders:9_000_000}));
 assert.equal(x.hooks.length,16);assert.equal(x.hooks[0].length,512);assert.equal(x.renders,1_000_000);
});
test('deep and cyclic sandbox hook values become bounded data',()=>{
 const a=JSON.parse('{"__proto__":{"polluted":true},"constructor":"bad","safe":1}');a.cycle=a;
 const x=previewDiagnostic(msg({type:'STATE',hooks:[a],renders:1})).hooks[0];
 assert.equal(Object.hasOwn(x,'__proto__'),false);assert.equal(Object.hasOwn(x,'constructor'),false);assert.equal(x.safe,1);assert.equal(x.cycle.cycle.cycle,'[unsupported]');
});
