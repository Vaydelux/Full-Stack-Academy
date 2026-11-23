import test from 'node:test';
import assert from 'node:assert/strict';
import {signWebhook,WebhookInbox} from './labs.mjs';

const key='synthetic-strong-secret';
const body=Buffer.from('{"operation":"updated","version":3}');
const at=1_000_000;
const event=(overrides={})=>({
 provider:'provider-1',tenantId:'tenant-a',eventId:'event-1',body,
 timestamp:at,secret:key,now:at,...overrides,
});
const signed=(overrides={})=>{
 const e=event(overrides);
 return {...e,signature:signWebhook(e.secret,e.body,e.timestamp,e.provider,e.eventId)};
};
const denies=(fn,message)=>assert.throws(fn,error=>error.message===message);

test('v2 signature is deterministic for exact authentic envelope',()=>{
 assert.equal(signWebhook(key,body,at,'provider-1','event-1'),signWebhook(key,body,at,'provider-1','event-1'));
});
test('v2 signature changes with provider',()=>{
 assert.notEqual(signWebhook(key,body,at,'provider-1','event-1'),signWebhook(key,body,at,'provider-2','event-1'));
});
test('v2 signature changes with event ID',()=>{
 assert.notEqual(signWebhook(key,body,at,'provider-1','event-1'),signWebhook(key,body,at,'provider-1','event-2'));
});
test('v2 signature changes with raw bytes',()=>{
 assert.notEqual(signWebhook(key,body,at,'provider-1','event-1'),signWebhook(key,Buffer.from('{"version":3,"operation":"updated"}'),at,'provider-1','event-1'));
});
test('v2 signature changes with timestamp',()=>{
 assert.notEqual(signWebhook(key,body,at,'provider-1','event-1'),signWebhook(key,body,at+1,'provider-1','event-1'));
});
test('v2 requires provider and event ID',()=>{
 denies(()=>signWebhook(key,body,at,undefined,'event-1'),'invalid-webhook');
 denies(()=>signWebhook(key,body,at,'provider-1',''),'invalid-webhook');
});
test('inbox accepts a signed valid event once',()=>{
 const inbox=new WebhookInbox(),e=signed();
 assert.equal(inbox.accept(e).status,'accepted');
 assert.equal(inbox.accept(e).status,'duplicate');
});
test('inbox rejects changed provider even when key is identical',()=>{
 const inbox=new WebhookInbox(),e=signed();
 denies(()=>inbox.accept({...e,provider:'provider-2'}),'invalid-signature');
});
test('inbox rejects changed event ID even when key is identical',()=>{
 const inbox=new WebhookInbox(),e=signed();
 denies(()=>inbox.accept({...e,eventId:'event-2'}),'invalid-signature');
});
test('inbox requires a trusted server tenant binding; HMAC does not cover tenant',()=>{
 const inbox=new WebhookInbox(),e=signed();
 assert.equal(inbox.accept(e).status,'accepted');
 assert.equal(inbox.accept({...e,tenantId:'tenant-b'}).status,'accepted');
});
test('inbox rejects changed body bytes after signing',()=>{
 const inbox=new WebhookInbox(),e=signed();
 denies(()=>inbox.accept({...e,body:Buffer.from('different')}),'invalid-signature');
});
test('inbox rejects replay of the same signed ID with different authentic payload',()=>{
 const inbox=new WebhookInbox(),e=signed();inbox.accept(e);
 const changed=signed({body:Buffer.from('{"operation":"deleted"}')});
 denies(()=>inbox.accept(changed),'delivery-conflict');
});
test('inbox denies stale signed timestamp',()=>{
 const inbox=new WebhookInbox(),e=signed({now:at+300_001});
 denies(()=>inbox.accept(e),'stale-webhook');
});
test('inbox rejects oversized payload before accepting',()=>{
 const inbox=new WebhookInbox(),e=signed({body:Buffer.alloc(65_537,1)});
 denies(()=>inbox.accept(e),'invalid-body');
});
test('inbox claim/ack is terminal and does not expose internal body buffer',()=>{
 const inbox=new WebhookInbox(),e=signed();const receipt=inbox.accept(e);
 const claimed=inbox.claim(receipt.id);assert.equal(claimed.status,'processing');
 claimed.body.fill(0);assert.equal(inbox.settle(receipt.id,true).status,'processed');
 assert.equal(inbox.claim(receipt.id),null);
});
