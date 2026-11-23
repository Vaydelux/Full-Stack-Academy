import test from 'node:test';
import assert from 'node:assert/strict';
import {fork} from 'node:child_process';
import {mkdtempSync,mkdirSync,rmdirSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {DurableWebhookInbox} from './durable-inbox.mjs';
import {signWebhook} from './labs.mjs';
const workerPath=fileURLToPath(new URL('./inbox-race-worker.mjs',import.meta.url));
const body=Buffer.from('synthetic-parallel-delivery');
const eventId='same-event';
const input=()=>{
 const provider='sender',tenantId='north',eventId='same-event',secret='synthetic-strong-webhook-signing-key',now=1000000;
 return {provider,tenantId,eventId,body,timestamp:now,now,secret,signature:signWebhook(secret,body,now,provider,eventId)};
};
const fixture=t=>{
 const dir=mkdtempSync(join(tmpdir(),'p5-inbox-race-'));
 t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const filePath=join(dir,'events.json'),encryptionKey=randomBytes(32);
 const open=()=>new DurableWebhookInbox({filePath,encryptionKey,clock:()=>1000000});
 return {filePath,encryptionKey,open,dir};
};
async function pair(t,fixture,mode,id){
 const jobs=[];
 for(let index=0;index<2;index++){
  const child=fork(workerPath,[mode,fixture.filePath,id],{
   stdio:['ignore','ignore','pipe','ipc'],
   env:{...process.env,P5_RACE_TEST_KEY:fixture.encryptionKey.toString('hex')},
  });
  t.after(()=>{if(!child.killed)child.kill();});
  const ready=new Promise((resolve,reject)=>{
   child.once('message',message=>message.ready?resolve():reject(Error(message.error??'worker-start-failed')));
   child.once('error',reject);
   child.once('exit',code=>reject(Error('worker-exited:'+code)));
  });
  jobs.push({child,ready});
 }
 await Promise.all(jobs.map(j=>j.ready));
 const complete=jobs.map(({child})=>new Promise((resolve,reject)=>{
  child.once('message',resolve);
  child.once('error',reject);
  child.send('go');
 }));
 return Promise.all(complete);
}

test('interprocess lock allows at most one write to win when snapshots match',async t=>{
 for(let attempt=0;attempt<6;attempt++){
  const f=fixture(t),results=await pair(t,f,'accept',eventId);
  assert.equal(results.filter(r=>r.ok&&r.status==='accepted').length,1,JSON.stringify(results));
  assert.equal(results.filter(r=>!r.ok&&['inbox-busy','stale-inbox-snapshot'].includes(r.error)).length,1,JSON.stringify(results));
  const storage=JSON.parse(readFileSync(f.filePath,'utf8'));
  assert.equal(storage.rows.length,1);
  assert.equal(f.open().inspect(JSON.stringify(['sender','north',eventId])).status,'pending');
 }
});

test('simultaneously spawned workers cannot claim the same delivery twice',async t=>{
 for(let attempt=0;attempt<6;attempt++){
  const f=fixture(t),id=f.open().accept(input()).id;
  const results=await pair(t,f,'claim',id);
  assert.equal(results.filter(r=>r.ok&&r.status==='processing').length,1,JSON.stringify(results));
  assert.equal(results.filter(r=>!r.ok&&['inbox-busy','stale-inbox-snapshot'].includes(r.error)).length,1,JSON.stringify(results));
  const reopened=f.open();
  assert.equal(reopened.inspect(id).attempts,1);
  assert.equal(reopened.inspect(id).status,'processing');
  assert.equal(reopened.claim(id),null);
 }
});

test('existing lock refuses writes without modifying persisted data',t=>{
 const f=fixture(t),s=f.open(),e=input();s.accept(e);
 const bytes=readFileSync(f.filePath);
 mkdirSync(f.filePath+'.lock',{mode:0o700});
 assert.throws(()=>s.accept({...e,eventId:'another',signature:signWebhook(e.secret,e.body,e.timestamp,e.provider,'another')}),{message:'inbox-busy'});
 assert.deepEqual(readFileSync(f.filePath),bytes);
 rmdirSync(f.filePath+'.lock');
 assert.equal(s.accept({...e,eventId:'another',signature:signWebhook(e.secret,e.body,e.timestamp,e.provider,'another')}).status,'accepted');
});

test('a crash-orphaned lock requires an explicit operator action, never auto-reclaim',t=>{
 const f=fixture(t),s=f.open();mkdirSync(f.filePath+'.lock',{mode:0o700});
 assert.throws(()=>s.accept(input()),{message:'inbox-busy'});
 assert.throws(()=>s.accept(input()),{message:'inbox-busy'});
 rmdirSync(f.filePath+'.lock'); // controlled recovery simulation after all writers stopped
 assert.equal(s.accept(input()).status,'accepted');
});

test('stale duplicate read cannot falsely claim the latest delivery state',t=>{
 const f=fixture(t),old=f.open(),newer=f.open();newer.accept(input());
 assert.throws(()=>old.inspect(JSON.stringify(['sender','north',eventId])),{message:'stale-inbox-snapshot'});
 assert.throws(()=>old.accept(input()),{message:'stale-inbox-snapshot'});
 assert.throws(()=>old.claim(JSON.stringify(['sender','north',eventId])),{message:'stale-inbox-snapshot'});
});

test('exhausted-lease transition rolls back when another worker holds lock',t=>{
 const f=fixture(t),inbox=f.open(),id=inbox.accept(input()).id;
 // One maximum attempt: after expiry the next claim must dead-letter.
 const worker=new DurableWebhookInbox({filePath:f.filePath,encryptionKey:f.encryptionKey,clock:()=>1000000,maxAttempts:1,leaseMs:100});
 const first=worker.claim(id);
 assert.ok(first);
 const expired=new DurableWebhookInbox({filePath:f.filePath,encryptionKey:f.encryptionKey,clock:()=>1000100,maxAttempts:1,leaseMs:100});
 mkdirSync(f.filePath+'.lock',{mode:0o700});
 assert.throws(()=>expired.claim(id),{message:'inbox-busy'});
 rmdirSync(f.filePath+'.lock');
 assert.equal(expired.inspect(id).status,'processing');
 assert.equal(expired.claim(id),null);
 assert.equal(f.open().inspect(id).status,'dead-letter');
});

test('post-rename failure poisons the writer and requires independent reopen reconciliation',t=>{
 const f=fixture(t);
 const injected=new DurableWebhookInbox({filePath:f.filePath,encryptionKey:f.encryptionKey,
  clock:()=>1000000,afterRename:()=>{throw Error('injected-directory-sync-failure');}});
 assert.throws(()=>injected.accept(input()),{message:'inbox-commit-uncertain'});
 assert.throws(()=>injected.inspect(JSON.stringify(['sender','north',eventId])),{message:'inbox-reopen-required'});
 assert.throws(()=>injected.accept(input()),{message:'inbox-reopen-required'});
 assert.equal(f.open().inspect(JSON.stringify(['sender','north',eventId])).status,'pending');
});

test('invalid post-rename hook is rejected at startup',t=>{
 const f=fixture(t);
 assert.throws(()=>new DurableWebhookInbox({filePath:f.filePath,encryptionKey:f.encryptionKey,afterRename:true}),{message:'invalid-fault-injector'});
});
