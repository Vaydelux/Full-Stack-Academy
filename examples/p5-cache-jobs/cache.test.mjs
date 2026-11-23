import test from 'node:test';
import assert from 'node:assert/strict';
import {tenantKey, MemoryTTLCache, CacheAsideCatalog} from './cache.mjs';
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return {promise, resolve, reject}; };
function setup({ttlMs=50}={}) {
 let now=0; const data=new Map([['alpha/a',{value:'one'}],['beta/a',{value:'two'}]]);
 const store={
   async read(tenant,id){return structuredClone(data.get(tenant+'/'+id)??null)},
   async write(tenant,id,value){data.set(tenant+'/'+id,structuredClone(value));return {ok:true}}
 };
 const cache = new MemoryTTLCache({now:()=>now,maxEntries:2});
 const catalog = new CacheAsideCatalog({store,cache,ttlMs});
 return {catalog,cache,data,store,advance:n=>{now+=n}};
}
test('tenant keys cannot collide across tenants',()=>assert.notEqual(tenantKey('alpha','a'),tenantKey('beta','a')));
test('invalid keys are rejected, not silently normalized',()=>{for(const bad of ['','../beta','a:b','a/b','a b'])assert.throws(()=>tenantKey(bad,'a'))});
test('first read loads store, second read is a hit',async()=>{const {catalog}=setup();assert.equal((await catalog.read('alpha','a')).value,'one');assert.equal((await catalog.read('alpha','a')).value,'one');assert.deepEqual(catalog.metrics,{hits:1,misses:1,coalesced:0,loads:1})});
test('tenant reads do not share values',async()=>{const {catalog}=setup();assert.equal((await catalog.read('beta','a')).value,'two');assert.equal((await catalog.read('alpha','a')).value,'one')});
test('TTL expiry causes a reload',async()=>{const s=setup();await s.catalog.read('alpha','a');s.data.set('alpha/a',{value:'changed'});s.advance(50);assert.equal((await s.catalog.read('alpha','a')).value,'changed')});
test('cached value cannot be mutated by a caller',async()=>{const {catalog}=setup();const value=await catalog.read('alpha','a');value.value='poison';assert.equal((await catalog.read('alpha','a')).value,'one')});
test('writer invalidates cache synchronously and exposes newest value',async()=>{const s=setup();await s.catalog.read('alpha','a');await s.catalog.write('alpha','a',{value:'new'});assert.equal((await s.catalog.read('alpha','a')).value,'new')});
test('writer cannot invalidate another tenant cache',async()=>{const s=setup();await s.catalog.read('alpha','a');await s.catalog.read('beta','a');await s.catalog.write('alpha','a',{value:'new'});assert.equal((await s.catalog.read('beta','a')).value,'two');assert.equal(s.catalog.metrics.hits,1)});
test('concurrent reads coalesce into one store load',async()=>{const s=setup();const gate=deferred();let count=0;s.store.read=async()=>{count++;await gate.promise;return {value:'ok'}};const reads=Array.from({length:5},()=>s.catalog.read('alpha','a'));gate.resolve();assert.deepEqual((await Promise.all(reads)).map(x=>x.value),Array(5).fill('ok'));assert.equal(count,1);assert.equal(s.catalog.metrics.coalesced,4)});
test('a stale in-flight read after a write retries and returns fresh data',async()=>{const s=setup();const gate=deferred();let loads=0;const original=s.store.read;s.store.read=async(t,i)=>{loads++;if(loads===1){const old=await original(t,i);await gate.promise;return old;}return original(t,i)};const p=s.catalog.read('alpha','a');await s.catalog.write('alpha','a',{value:'new'});gate.resolve();assert.equal((await p).value,'new');assert.equal(loads,2)});
test('reads wait for an in-progress write',async()=>{const s=setup();const gate=deferred();const original=s.store.write;s.store.write=async(...args)=>{await gate.promise;return original(...args)};const write=s.catalog.write('alpha','a',{value:'after'});const pending=s.catalog.read('alpha','a');gate.resolve();await write;assert.equal((await pending).value,'after')});
test('failed reads are not cached and can retry',async()=>{const s=setup();let calls=0;const read=s.store.read;s.store.read=async(...args)=>{if(++calls===1)throw Error('down');return read(...args)};await assert.rejects(s.catalog.read('alpha','a'),/down/);assert.equal((await s.catalog.read('alpha','a')).value,'one')});
test('missing objects are not negatively cached',async()=>{const s=setup();assert.equal(await s.catalog.read('alpha','missing'),null);s.data.set('alpha/missing',{value:'born'});assert.equal((await s.catalog.read('alpha','missing')).value,'born')});
test('memory cache bounded by capacity',()=>{const c=new MemoryTTLCache({now:()=>0,maxEntries:2});c.set('a',1,100);c.set('b',2,100);c.set('c',3,100);assert.equal(c.size,2);assert.equal(c.get('a'),undefined);assert.equal(c.get('b'),2)});
test('TTL validation rejects unbounded entries',()=>{const c=new MemoryTTLCache();for(const ttl of [0,-1,1.1,1e10])assert.throws(()=>c.set('x',1,ttl))});
test('hit ratio handles no observations',()=>{const {catalog}=setup();assert.equal(catalog.hitRatio,null)});
