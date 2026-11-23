import test from 'node:test';
import assert from 'node:assert/strict';
import {OutboxSimulator,InMemoryIdempotentConsumer} from './outbox.mjs';
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve}};
function setup(){let now=0;return {outbox:new OutboxSimulator({now:()=>now,maxAttempts:3,baseBackoffMs:10,leaseMs:30}),advance:n=>now+=n};}
const enqueue=box=>box.enqueue({id:'event1',tenantId:'alpha',type:'email',payload:{to:'example.invalid'}});
test('enqueue stores pending event metadata',()=>{const s=setup();const x=enqueue(s.outbox);assert.equal(x.status,'pending');assert.equal(s.outbox.pending(),1)});
test('duplicate ID is rejected, not silently overwritten',()=>{const s=setup();enqueue(s.outbox);assert.throws(()=>enqueue(s.outbox),/Duplicate/)});
test('invalid tenant or event identifiers rejected',()=>{const s=setup();assert.throws(()=>s.outbox.enqueue({id:'a/b',tenantId:'alpha',type:'email',payload:{}}));assert.throws(()=>s.outbox.enqueue({id:'a',tenantId:'../beta',type:'email',payload:{}}))});
test('successful handler marks one event done',async()=>{const s=setup();enqueue(s.outbox);assert.deepEqual(await s.outbox.dispatchNext(async()=>{}),{status:'done',id:'event1'});assert.equal(s.outbox.pending(),0);assert.equal(s.outbox.status('event1').attempts,1)});
test('failed attempt retries after backoff',async()=>{const s=setup();enqueue(s.outbox);assert.equal((await s.outbox.dispatchNext(async()=>{throw Error('offline')})).status,'retry');assert.equal((await s.outbox.dispatchNext(async()=>{})).status,'idle');s.advance(10);assert.equal((await s.outbox.dispatchNext(async()=>{})).status,'done')});
test('maximum failed attempts enter dead state',async()=>{const s=setup();enqueue(s.outbox);for(const delay of [0,10,20]){s.advance(delay);await s.outbox.dispatchNext(async()=>{throw Error('bad')})}assert.equal(s.outbox.status('event1').status,'dead');assert.equal((await s.outbox.dispatchNext(async()=>{})).status,'idle')});
test('dead-letter redrive requires explicit action',async()=>{const s=setup();enqueue(s.outbox);for(const delay of [0,10,20]){s.advance(delay);await s.outbox.dispatchNext(async()=>{throw Error('bad')})}assert.equal(s.outbox.redrive('event1'),true);assert.equal((await s.outbox.dispatchNext(async()=>{})).status,'done')});
test('claim prevents concurrent workers running the same live lease',async()=>{const s=setup();enqueue(s.outbox);const gate=deferred();let calls=0;const slow=s.outbox.dispatchNext(async()=>{calls++;await gate.promise});assert.equal((await s.outbox.dispatchNext(async()=>{calls++})).status,'idle');gate.resolve();assert.equal((await slow).status,'done');assert.equal(calls,1)});
test('expired lease permits redelivery, late worker cannot overwrite completion',async()=>{const s=setup();enqueue(s.outbox);const gate=deferred();const slow=s.outbox.dispatchNext(async()=>{await gate.promise});s.advance(30);assert.equal((await s.outbox.dispatchNext(async()=>{})).status,'done');gate.resolve();assert.equal((await slow).status,'lease-lost');assert.equal(s.outbox.status('event1').status,'done')});
test('handler receives copied event so mutation does not alter outbox',async()=>{const s=setup();enqueue(s.outbox);await s.outbox.dispatchNext(async event=>{event.payload.to='changed'});assert.equal(s.outbox.status('event1').payload.to,'example.invalid')});
test('idle result on empty outbox',async()=>assert.deepEqual(await setup().outbox.dispatchNext(async()=>{}),{status:'idle'}));
test('idempotent consumer prevents duplicate sequential effects',async()=>{const c=new InMemoryIdempotentConsumer();let calls=0;const fn=()=>{calls++;return {ok:true}};assert.deepEqual(await c.once('evt',fn),{ok:true});await c.once('evt',fn);assert.equal(calls,1)});
test('idempotent consumer coalesces concurrent effects',async()=>{const c=new InMemoryIdempotentConsumer();const gate=deferred();let calls=0;const work=()=>{calls++;return gate.promise.then(()=>42)};const a=c.once('evt',work);const b=c.once('evt',work);gate.resolve();assert.deepEqual(await Promise.all([a,b]),[42,42]);assert.equal(calls,1)});
test('failed local effect is retriable',async()=>{const c=new InMemoryIdempotentConsumer();await assert.rejects(c.once('evt',()=>{throw Error('temporary')}));assert.equal(await c.once('evt',()=>7),7)});
test('completed result cannot be mutated externally',async()=>{const c=new InMemoryIdempotentConsumer();const first=await c.once('evt',()=>({a:1}));first.a=900;assert.equal((await c.once('evt',()=>({a:2}))).a,1)});
test('expired leases consume the attempt budget and cannot run forever',async()=>{
 const s=setup();enqueue(s.outbox);const gates=[deferred(),deferred(),deferred()];const attempts=[];
 for(let i=0;i<3;i++){attempts.push(s.outbox.dispatchNext(async()=>{await gates[i].promise}));s.advance(30);}
 let ran=false;assert.equal((await s.outbox.dispatchNext(async()=>{ran=true})).status,'dead');assert.equal(ran,false);
 for(const gate of gates)gate.resolve();assert.deepEqual((await Promise.all(attempts)).map(x=>x.status),['lease-lost','lease-lost','lease-lost']);
 assert.equal(s.outbox.status('event1').attempts,3);
});
