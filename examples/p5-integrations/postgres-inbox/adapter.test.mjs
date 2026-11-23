import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes,createHmac,randomUUID} from 'node:crypto';
import {PostgresWebhookInbox,SQL} from './adapter.mjs';

const signingKey='local-instructor-webhook-signing-key';
const fixedNow=1_000_000;
const body=Buffer.from('{"event":"a","version":1}');
const sign=(payload=body,provider='sender',eventId='e1',timestamp=fixedNow)=>createHmac('sha256',signingKey).update(
 JSON.stringify(['p5-webhook-v2',provider,eventId,timestamp,payload.toString('base64')])
).digest('hex');
const event=(changes={})=>{const d={provider:'sender',eventId:'e1',body,timestamp:fixedNow,...changes};return {...d,signature:sign(d.body,d.provider,d.eventId,d.timestamp)};};
const key=(t,p,e)=>JSON.stringify([t,p,e]);
const clone=x=>structuredClone(x);

class MockPool {
 constructor(){this.store=new Map();this.calls=[];this.releases=0;this.discards=[];this.clock=fixedNow;this.fail=null;}
 async connect(){
  const pool=this;let rows=null,tenant=null;
  return {
   async query(sql,args=[]){
    pool.calls.push({sql,args});
    if(pool.fail && (pool.fail===sql||pool.fail==='any'))throw Error('simulated-db-failure');
    if(sql==='BEGIN'){rows=new Map([...pool.store].map(([id,row])=>[id,clone(row)]));return {rowCount:null,rows:[]};}
    if(sql==='COMMIT'){pool.store=rows;rows=null;return {rowCount:null,rows:[]};}
    if(sql==='ROLLBACK'){rows=null;return {rowCount:null,rows:[]};}
    if(sql===SQL.context){assert.ok(rows);tenant=args[0];return {rowCount:1,rows:[{}]};}
    assert.ok(rows,'must be in transaction');
    if(sql===SQL.insert){const [t,p,e,digest,encrypted_body,iv,auth_tag]=args;assert.equal(t,tenant);
     const id=key(t,p,e);if(rows.has(id))return {rowCount:0,rows:[]};
     const row={tenant_id:t,provider:p,event_id:e,payload_digest:digest,
      encrypted_body,iv,auth_tag,state:'pending',attempts:0,next_at:pool.clock,lease_token:null,lease_expires_at:null,created_at:pool.clock};
     rows.set(id,row);return {rowCount:1,rows:[row]};}
    if(sql===SQL.duplicate){const [t,p,e]=args;assert.equal(t,tenant);const row=rows.get(key(t,p,e));return {rowCount:row?1:0,rows:row?[row]:[]};}
    if(sql===SQL.expire){const [t,maxAttempts]=args;assert.equal(t,tenant);let count=0;
     for(const row of rows.values())if(row.tenant_id===t&&row.state==='processing'&&row.lease_expires_at<=pool.clock&&row.attempts>=maxAttempts){row.state='dead-letter';row.lease_token=null;row.lease_expires_at=null;count++;}return {rowCount:count,rows:[]};}
    if(sql===SQL.candidate){const [t,maxAttempts]=args;assert.equal(t,tenant);const matches=[...rows.values()].filter(row=>row.tenant_id===t&&row.attempts<maxAttempts&&((row.state==='pending'&&row.next_at<=pool.clock)||(row.state==='processing'&&row.lease_expires_at<=pool.clock)));return {rowCount:matches.length?1:0,rows:matches.slice(0,1)};}
    if(sql===SQL.claim){const [t,p,e,lease,leaseMs]=args;assert.equal(t,tenant);const row=rows.get(key(t,p,e));assert.ok(row);row.state='processing';row.attempts++;row.lease_token=lease;row.lease_expires_at=pool.clock+leaseMs;return {rowCount:1,rows:[row]};}
    if(sql===SQL.settle){const [t,p,e,lease,ok,maxAttempts,retryable]=args;assert.equal(t,tenant);const row=rows.get(key(t,p,e));if(!row||row.state!=='processing'||row.lease_token!==lease||row.lease_expires_at<=pool.clock)return {rowCount:0,rows:[]};
     row.state=ok?'processed':row.attempts>=maxAttempts||!retryable?'dead-letter':'pending';row.lease_token=null;row.lease_expires_at=null;row.next_at=pool.clock+1000;return {rowCount:1,rows:[row]};}
    if(sql===SQL.inspect){const [t,p,e]=args;assert.equal(t,tenant);const row=rows.get(key(t,p,e));return {rowCount:row?1:0,rows:row?[row]:[]};}
    throw Error('unknown-query');
   },
   release(discard){pool.releases++;pool.discards.push(discard===true);}
  };
 }
}
const setup=(changes={})=>{const pool=new MockPool(),key=randomBytes(32);
 const inbox=new PostgresWebhookInbox({pool,tenantId:'north',encryptionKey:key,webhookSecrets:{sender:signingKey},clock:()=>fixedNow,...changes});
 return {pool,key,inbox};};
const rejectCode=async(promise,code)=>assert.rejects(promise,e=>e.message===code);

test('constructor refuses missing pool',()=>assert.throws(()=>new PostgresWebhookInbox({tenantId:'north',encryptionKey:randomBytes(32),webhookSecrets:{sender:signingKey}}),/invalid-pool/));
test('constructor rejects malformed tenant',()=>assert.throws(()=>setup({tenantId:'../outside'}),/invalid-tenant/));
test('constructor requires 256-bit encryption key',()=>assert.throws(()=>setup({encryptionKey:randomBytes(16)}),/invalid-encryption-key/));
test('constructor requires at least one server-owned signing binding',()=>assert.throws(()=>setup({webhookSecrets:{}}),/invalid-webhook-binding/));
test('constructor refuses weak signing secret',()=>assert.throws(()=>setup({webhookSecrets:{sender:'x'}}),/invalid-webhook-binding/));
test('constructor rejects invalid lease values',()=>assert.throws(()=>setup({leaseMs:1}),/invalid-lease/));
test('constructor rejects invalid max attempts',()=>assert.throws(()=>setup({maxAttempts:21}),/invalid-attempts/));
test('malformed event identity rejected before DB',async()=>{const {pool,inbox}=setup();await rejectCode(inbox.accept(event({eventId:'../bad'})),'invalid-webhook');assert.equal(pool.calls.length,0);});
test('unknown provider rejected before DB',async()=>{const {pool,inbox}=setup();await rejectCode(inbox.accept(event({provider:'unknown'})),'unregistered-provider');assert.equal(pool.calls.length,0);});
test('payload over 64KiB rejected',async()=>{const {inbox}=setup();await rejectCode(inbox.accept(event({body:Buffer.alloc(65537)})),'invalid-body');});
test('expired webhook rejected before DB',async()=>{const {inbox}=setup();await rejectCode(inbox.accept(event({timestamp:0})),'stale-webhook');});
test('forged event ID cannot reuse original signature',async()=>{const {inbox}=setup();const input=event();await rejectCode(inbox.accept({...input,eventId:'e2'}),'invalid-signature');});
test('forged payload bytes cannot reuse original signature',async()=>{const {inbox}=setup();const input=event();await rejectCode(inbox.accept({...input,body:Buffer.from('fake')}),'invalid-signature');});
test('accept stores encrypted bytes and digest but no plaintext',async()=>{const {pool,inbox}=setup();const result=await inbox.accept(event());assert.equal(result.status,'accepted');const stored=[...pool.store.values()][0];assert.equal(Buffer.isBuffer(stored.encrypted_body),true);assert.notEqual(stored.encrypted_body.toString(),body.toString());assert.equal(stored.payload_digest.length,64);assert.equal(pool.releases,1);});
test('accept idempotently replays same tenant/provider/event',async()=>{const {pool,inbox}=setup();assert.equal((await inbox.accept(event())).status,'accepted');assert.equal((await inbox.accept(event())).status,'duplicate');assert.equal(pool.store.size,1);});
test('same signed event ID with changed authentic body fails conflict',async()=>{const {pool,inbox}=setup();await inbox.accept(event());await rejectCode(inbox.accept(event({body:Buffer.from('changed')})),'delivery-conflict');assert.equal(pool.store.size,1);});
test('two server-bound tenants cannot access each other',async()=>{const {pool,key,inbox}=setup();const south=new PostgresWebhookInbox({pool,tenantId:'south',encryptionKey:key,webhookSecrets:{sender:signingKey},clock:()=>fixedNow});await inbox.accept(event());assert.equal(await south.inspect({provider:'sender',eventId:'e1'}),null);assert.equal((await south.accept(event())).status,'accepted');assert.equal(pool.store.size,2);});
test('transaction context is set after BEGIN and before data statements',async()=>{const {pool,inbox}=setup();await inbox.accept(event());assert.deepEqual(pool.calls.map(x=>x.sql).slice(0,3),['BEGIN',SQL.context,SQL.insert]);assert.equal(pool.calls.at(-1).sql,'COMMIT');});
test('claim decrypts exact bytes and provides lease fencing',async()=>{const {inbox}=setup();await inbox.accept(event());const claim=await inbox.claimNext();assert.deepEqual(claim.body,body);assert.equal(claim.attempts,1);assert.match(claim.leaseToken,/^[a-f0-9-]{36}$/);assert.equal(claim.tenantId,'north');});
test('claim uses SELECT FOR UPDATE SKIP LOCKED',()=>assert.match(SQL.candidate,/FOR UPDATE SKIP LOCKED LIMIT 1/));
test('claim and settlement do not overlap for active lease',async()=>{const {inbox}=setup();await inbox.accept(event());const first=await inbox.claimNext();assert.equal(await inbox.claimNext(),null);assert.equal((await inbox.settle({provider:'sender',eventId:'e1',leaseToken:first.leaseToken,ok:true})).status,'processed');assert.equal(await inbox.claimNext(),null);});
test('stale lease token cannot settle a delivery',async()=>{const {inbox}=setup();await inbox.accept(event());await inbox.claimNext();await rejectCode(inbox.settle({provider:'sender',eventId:'e1',leaseToken:randomUUID(),ok:true}),'stale-lease');});
test('expired lease token cannot settle a delivery',async()=>{const {pool,inbox}=setup();await inbox.accept(event());const c=await inbox.claimNext();pool.clock+=30000;await rejectCode(inbox.settle({provider:'sender',eventId:'e1',leaseToken:c.leaseToken,ok:true}),'stale-lease');});
test('worker retries expired lease with a new token',async()=>{const {pool,inbox}=setup();await inbox.accept(event());const first=await inbox.claimNext();pool.clock+=30000;const second=await inbox.claimNext();assert.equal(second.attempts,2);assert.notEqual(second.leaseToken,first.leaseToken);});
test('retryable errors requeue for later',async()=>{const {pool,inbox}=setup();await inbox.accept(event());const c=await inbox.claimNext();assert.equal((await inbox.settle({provider:'sender',eventId:'e1',leaseToken:c.leaseToken,ok:false,retryable:true})).status,'pending');assert.equal(await inbox.claimNext(),null);pool.clock+=1000;assert.equal((await inbox.claimNext()).attempts,2);});
test('nonretryable errors dead-letter immediately',async()=>{const {inbox}=setup();await inbox.accept(event());const c=await inbox.claimNext();assert.equal((await inbox.settle({provider:'sender',eventId:'e1',leaseToken:c.leaseToken,ok:false,retryable:false})).status,'dead-letter');});
test('exhausted retry budget dead-letters',async()=>{const {pool,inbox}=setup({maxAttempts:1});await inbox.accept(event());await inbox.claimNext();pool.clock+=30000;assert.equal(await inbox.claimNext(),null);assert.equal((await inbox.inspect({provider:'sender',eventId:'e1'})).status,'dead-letter');});
test('inspect never returns stored ciphertext',async()=>{const {inbox}=setup();await inbox.accept(event());const value=await inbox.inspect({provider:'sender',eventId:'e1'});assert.equal(value.status,'pending');assert.equal(Object.hasOwn(value,'encryptedBody'),false);assert.equal(Object.hasOwn(value,'payload_digest'),false);});
test('DB failure rolls back and releases pooled client',async()=>{const {pool,inbox}=setup();pool.fail=SQL.insert;await assert.rejects(inbox.accept(event()),/simulated-db-failure/);assert.equal(pool.store.size,0);assert.deepEqual(pool.calls.map(c=>c.sql).slice(-2),[SQL.insert,'ROLLBACK']);assert.equal(pool.releases,1);});
test('corrupted encrypted payload fails and rolls back claim',async()=>{const {pool,inbox}=setup();await inbox.accept(event());[...pool.store.values()][0].encrypted_body=Buffer.from('wrong');await rejectCode(inbox.claimNext(),'corrupt-payload');assert.equal([...pool.store.values()][0].attempts,0);});
test('wrong key cannot decrypt a claimed payload',async()=>{const {pool,inbox}=setup();await inbox.accept(event());const wrong=new PostgresWebhookInbox({pool,tenantId:'north',encryptionKey:randomBytes(32),webhookSecrets:{sender:signingKey},clock:()=>fixedNow});await rejectCode(wrong.claimNext(),'corrupt-payload');});
test('invalid settlement values fail closed before SQL',async()=>{const {pool,inbox}=setup();await rejectCode(inbox.settle({provider:'sender',eventId:'e1',leaseToken:'invalid',ok:true}),'invalid-lease-token');await rejectCode(inbox.settle({provider:'sender',eventId:'e1',leaseToken:randomUUID(),ok:'true'}),'invalid-outcome');assert.equal(pool.calls.length,0);});
test('parameterization applies to every SQL value',()=>{for(const statement of Object.values(SQL))assert.doesNotMatch(statement,/;\s*(?:DROP|ALTER)\b/i);assert.match(SQL.context,/\$1/);assert.match(SQL.insert,/VALUES \(\$1,\$2,\$3,\$4,\$5,\$6,\$7\)/);});

test('uncertain COMMIT acknowledgement discards pooled connection',async()=>{
 const {pool,inbox}=setup();pool.fail='COMMIT';
 await rejectCode(inbox.accept(event()),'db-commit-uncertain');
 assert.deepEqual(pool.discards,[true]);
});
test('ROLLBACK failure discards poisoned pooled connection',async()=>{
 const {pool,inbox}=setup();pool.fail=SQL.insert;
 const original=pool.connect.bind(pool);
 pool.connect=async()=>{const c=await original(),old=c.query.bind(c);
  c.query=(sql,args)=>sql==='ROLLBACK'?Promise.reject(Error('rollback-broken')):old(sql,args);
  return c;};
 await rejectCode(inbox.accept(event()),'db-rollback-uncertain');
 assert.deepEqual(pool.discards,[true]);
});
test('successful COMMIT releases reusable pooled connection',async()=>{
 const {pool,inbox}=setup();await inbox.accept(event());assert.deepEqual(pool.discards,[false]);
});
