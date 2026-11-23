import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,writeFileSync,chmodSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomBytes} from 'node:crypto';
import {DurableWebhookInbox} from './durable-inbox.mjs';
import {signWebhook} from './labs.mjs';
const b=Buffer.from('{"invoice":"SENSITIVE_999","status":"paid"}');
const setup=(t,options={})=>{
 let now=1000000;const dir=mkdtempSync(join(tmpdir(),'p5-private-inbox-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const filePath=join(dir,'inbox.json'),encryptionKey=randomBytes(32),clock=()=>now;
 const open=(overrides={})=>new DurableWebhookInbox({filePath,encryptionKey,clock,...options,...overrides});
 const input=(other={})=>{const p={provider:'sender',tenantId:'north',eventId:'delivery-1',body:b,timestamp:now,secret:'very-strong-provider-secret',now,...other};return {...p,signature:signWebhook(p.secret,p.body,p.timestamp,p.provider,p.eventId)};};
 return {open,input,filePath,get now(){return now;},advance:n=>now+=n,encryptionKey,dir};
};
const fails=(f,code)=>assert.throws(f,e=>e?.message===code);
test('accepts authentic event and commits to disk',t=>{const s=setup(t),i=s.open();const r=i.accept(s.input());assert.equal(r.status,'accepted');assert.equal(i.inspect(r.id).status,'pending');});
test('same event and body is idempotent',t=>{const s=setup(t),i=s.open(),e=s.input();assert.equal(i.accept(e).status,'accepted');assert.equal(i.accept(e).status,'duplicate');});
test('different body same authenticated ID conflicts',t=>{const s=setup(t),i=s.open();i.accept(s.input());fails(()=>i.accept(s.input({body:Buffer.from('different')})),'delivery-conflict');});
test('different provider and tenant IDs do not collide',t=>{const s=setup(t),i=s.open();for(const x of [{},{provider:'sender-2'},{tenantId:'south'}])assert.equal(i.accept(s.input(x)).status,'accepted');});
test('no plaintext or signing secret written',t=>{const s=setup(t),i=s.open();i.accept(s.input());const disk=readFileSync(s.filePath,'utf8');assert.ok(!disk.includes('SENSITIVE_999'));assert.ok(!disk.includes('very-strong-provider-secret'));});
test('cross-restart duplicate remains deduplicated',t=>{const s=setup(t),a=s.open();a.accept(s.input());const another=s.open();assert.equal(another.accept(s.input()).status,'duplicate');});
test('cross-restart processing recovers encrypted payload',t=>{const s=setup(t),a=s.open();const r=a.accept(s.input());const c=s.open().claim(r.id);assert.equal(c.body.toString(),b.toString());assert.equal(c.attempts,1);});
test('different decryption key refuses startup',t=>{const s=setup(t),a=s.open();a.accept(s.input());fails(()=>s.open({encryptionKey:randomBytes(32)}),'corrupt-inbox');});
test('ciphertext modification refuses startup',t=>{const s=setup(t),a=s.open();a.accept(s.input());const disk=JSON.parse(readFileSync(s.filePath));disk.rows[0].ciphertext='AAAA';writeFileSync(s.filePath,JSON.stringify(disk));fails(()=>s.open(),'corrupt-inbox');});
test('metadata ID tampering refuses startup',t=>{const s=setup(t),a=s.open();a.accept(s.input());const disk=JSON.parse(readFileSync(s.filePath));disk.rows[0].eventId='another';writeFileSync(s.filePath,JSON.stringify(disk));fails(()=>s.open(),'corrupt-inbox');});
test('invalid JSON refuses startup',t=>{const s=setup(t);writeFileSync(s.filePath,'NOT JSON',{mode:0o600});fails(()=>s.open(),'corrupt-inbox');});
test('world-readable data file is refused',t=>{const s=setup(t),a=s.open();a.accept(s.input());chmodSync(s.filePath,0o644);fails(()=>s.open(),'insecure-store-file');});
test('world-readable parent folder is refused',t=>{const s=setup(t);chmodSync(s.dir,0o755);fails(()=>s.open(),'insecure-store-directory');});
test('file symlink is refused',t=>{const s=setup(t);const target=join(s.dir,'target');writeFileSync(target,'{}');symlinkSync(target,s.filePath);fails(()=>s.open(),'insecure-store-file');});
test('relative store path is refused',t=>{const s=setup(t);fails(()=>s.open({filePath:'private/inbox.json'}),'invalid-store-path');});
test('invalid encryption key is refused',t=>{const s=setup(t);fails(()=>s.open({encryptionKey:Buffer.alloc(10)}),'invalid-encryption-key');});
test('unsigned event rejected',t=>{const s=setup(t),i=s.open();fails(()=>i.accept({...s.input(),signature:'0'.repeat(64)}),'invalid-signature');});
test('provider header substitution rejected',t=>{const s=setup(t),i=s.open();fails(()=>i.accept({...s.input(),provider:'different'}),'invalid-signature');});
test('event ID substitution rejected',t=>{const s=setup(t),i=s.open();fails(()=>i.accept({...s.input(),eventId:'different'}),'invalid-signature');});
test('expired timestamp rejected',t=>{const s=setup(t),i=s.open();fails(()=>i.accept({...s.input(),now:s.now+300001}),'stale-webhook');});
test('oversized payload rejected',t=>{const s=setup(t),i=s.open();fails(()=>i.accept(s.input({body:Buffer.alloc(65537)})),'invalid-body');});
test('capacity bound refuses new delivery but permits replay',t=>{const s=setup(t,{maxEvents:1}),i=s.open();const e=s.input();i.accept(e);fails(()=>i.accept(s.input({eventId:'delivery-2'})),'inbox-capacity');assert.equal(i.accept(e).status,'duplicate');});
test('claim prevents simultaneous duplicate processing',t=>{const s=setup(t),i=s.open(),r=i.accept(s.input());const c=i.claim(r.id);assert.equal(c.status,'processing');assert.equal(i.claim(r.id),null);});
test('successful settle persists across restart',t=>{const s=setup(t),i=s.open(),r=i.accept(s.input());const c=i.claim(r.id);assert.equal(i.settle(r.id,true,c.leaseToken).status,'processed');assert.equal(s.open().claim(r.id),null);});
test('failure requeues and keeps encrypted body',t=>{const s=setup(t),i=s.open(),r=i.accept(s.input());const c=i.claim(r.id);assert.equal(i.settle(r.id,false,c.leaseToken).status,'pending');assert.equal(s.open().claim(r.id).body.toString(),b.toString());});
test('lease fencing blocks fabricated token',t=>{const s=setup(t),i=s.open(),r=i.accept(s.input());i.claim(r.id);fails(()=>i.settle(r.id,true,'forged'),'stale-lease');});
test('claim lease after restart only when expired',t=>{const s=setup(t,{leaseMs:100}),i=s.open(),r=i.accept(s.input());const first=i.claim(r.id);assert.equal(s.open().claim(r.id),null);s.advance(100);const next=s.open().claim(r.id);assert.ok(next);assert.notEqual(next.leaseToken,first.leaseToken);});
test('expired stale completion is fenced even after reclaim',t=>{const s=setup(t,{leaseMs:100}),i=s.open(),r=i.accept(s.input());const first=i.claim(r.id);s.advance(100);const second=i.claim(r.id);fails(()=>i.settle(r.id,true,first.leaseToken),'stale-lease');assert.equal(i.settle(r.id,true,second.leaseToken).status,'processed');});
test('exhausted retry budget dead-letters',t=>{const s=setup(t,{maxAttempts:2}),i=s.open(),r=i.accept(s.input());for(let n=0;n<2;n++){const c=i.claim(r.id);assert.equal(i.settle(r.id,false,c.leaseToken).status,n?'dead-letter':'pending');}assert.equal(i.claim(r.id),null);assert.equal(s.open().inspect(r.id).status,'dead-letter');});
test('crash after claim exhausted lease returns once',t=>{const s=setup(t,{leaseMs:100,maxAttempts:1}),i=s.open(),r=i.accept(s.input());i.claim(r.id);s.advance(100);assert.equal(s.open().claim(r.id),null);assert.equal(s.open().inspect(r.id).status,'dead-letter');});
test('claiming unknown event returns null',t=>{const s=setup(t),i=s.open();assert.equal(i.claim('absent'),null);});

test('stale loaded instance cannot overwrite a newer accepted event',t=>{
 const s=setup(t),a=s.open(),b=s.open();a.accept(s.input());
 fails(()=>b.accept(s.input({eventId:'new'})),'stale-inbox-snapshot');
 assert.equal(s.open().inspect(JSON.stringify(['sender','north','delivery-1'])).status,'pending');
 assert.equal(s.open().inspect(JSON.stringify(['sender','north','new'])),null);
});
test('stale claim cannot silently overwrite a newer completion',t=>{
 const s=setup(t),a=s.open();const event=a.accept(s.input());const stale=s.open();
 const claim=a.claim(event.id);a.settle(event.id,true,claim.leaseToken);
 fails(()=>stale.claim(event.id),'stale-inbox-snapshot');
 assert.equal(s.open().inspect(event.id).status,'processed');
});

test('snapshot byte limit blocks writes before exceeding restart validation ceiling',t=>{
 const s=setup(t,{maxStoreBytes:1024}),a=s.open();
 const first=a.accept(s.input());
 fails(()=>a.accept(s.input({eventId:'delivery-2',body:Buffer.alloc(500,65)})),'inbox-storage-capacity');
 assert.equal(s.open().inspect(first.id).status,'pending');
 assert.equal(s.open().inspect(JSON.stringify(['sender','north','delivery-2'])),null);
});
test('unsafe snapshot size configuration rejected before writing',t=>{
 const s=setup(t);fails(()=>s.open({maxStoreBytes:10}),'invalid-store-limit');
});
