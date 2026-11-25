import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';
import {supabaseConfig} from '../p4-runtime/guard.mjs';
import {requireInstalled} from './guards.mjs';
function deadline(p,ms=12000){let timer;return Promise.race([p,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Timed out waiting for local service')),ms);})]).finally(()=>clearTimeout(timer));}
function join(channel){return deadline(new Promise(resolve=>channel.subscribe((status,error)=>{if(status==='SUBSCRIBED'||status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED')resolve({status,error});}))); }
function assertStorageDenied(error){assert.ok(error,'Expected Storage authorization denial');const status=Number(error.statusCode??error.status);assert.ok([400,401,403,404].includes(status),'Unexpected Storage failure');if(status===400)assert.match(error.message,/permission|unauthorized|not found|invalid.*token|row.level security|signature/i);}
export async function supabaseAcceptance(){
 requireInstalled(new URL('.',import.meta.url));const config=supabaseConfig(),{createClient}=await import('@supabase/supabase-js');
 const localFetch=(input,options={})=>{const u=new URL(input instanceof Request?input.url:input);assert.equal(u.origin,config.origin,'Nonlocal Supabase HTTP refused');return fetch(input,{...options,redirect:'error',signal:options.signal??AbortSignal.timeout(15000)});};
 const client=()=>createClient(config.origin,config.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{fetch:localFetch}});
 const clients=[client(),client(),client(),client()],[a,a2,b,anon]=clients;
 const bucket='academy-runtime-private';let path,otherPath;
 async function login(c,user){const {data,error}=await c.auth.signInWithPassword(user);assert.ok(!error&&data.session,'Local login failed');const check=await c.auth.getUser();assert.ok(!check.error&&check.data.user?.id===data.user.id&&check.data.user.email?.toLowerCase()===user.email.toLowerCase(),'Identity verification failed');await c.realtime.setAuth(data.session.access_token);return data.user.id;}
 try{
  const owner=await login(a,config.users[0]),second=await login(a2,config.users[0]),foreign=await login(b,config.users[1]);assert.equal(owner,second);assert.notEqual(owner,foreign);
  path=owner+'/'+randomUUID()+'.txt';otherPath=owner+'/'+randomUUID()+'.txt';
  const own=a.storage.from(bucket),other=b.storage.from(bucket),publicClient=anon.storage.from(bucket);
  const issued=await own.createSignedUploadUrl(path);assert.ok(!issued.error&&issued.data?.token,'Owner signed upload issuance failed');
  assertStorageDenied((await other.createSignedUploadUrl(path)).error);
  assertStorageDenied((await publicClient.uploadToSignedUrl(otherPath,issued.data.token,new Blob(['wrong path'],{type:'text/plain'}))).error);
  const text='academy signed upload '+randomUUID(),upload=await publicClient.uploadToSignedUrl(path,issued.data.token,new Blob([text],{type:'text/plain'}));assert.ok(!upload.error,'Signed upload redemption failed');
  const read=await own.download(path);assert.ok(!read.error&&read.data,'Owner download failed');assert.equal(await read.data.text(),text);
  assertStorageDenied((await other.download(path)).error);assertStorageDenied((await other.createSignedUrl(path,2)).error);
  const signed=await own.createSignedUrl(path,5);assert.ok(!signed.error&&signed.data?.signedUrl,'Signed download issuance failed');
  const url=new URL(signed.data.signedUrl);assert.equal(url.origin,config.origin);assert.ok(url.pathname.startsWith('/storage/v1/object/sign/'));
  const first=await localFetch(url);assert.equal(first.status,200);assert.equal(await first.text(),text);
  // Signed links are bearer capabilities. Verify expiry separately from Auth, without logging the token.
  const end=Date.now()+20000;let expired=false;
  while(Date.now()<end){await delay(1000);const res=await localFetch(url,{cache:'no-store'});if([400,401,403].includes(res.status)){expired=true;break;}assert.equal(res.status,200);}
  assert.ok(expired,'Signed link did not expire within bounded test window');const still=await own.download(path);assert.ok(!still.error&&still.data,'Object must still exist after token expiry');
  const topic='academy-runtime:'+owner,nonce=randomUUID();let received;
  const delivery=new Promise(resolve=>{received=resolve;});
  const listen=a2.channel(topic,{config:{private:true}}).on('broadcast',{event:'academy-test'},msg=>{if(msg.payload?.nonce===nonce)received(msg.payload);});
  const sender=a.channel(topic,{config:{private:true,broadcast:{ack:true}}});
  assert.equal((await join(listen)).status,'SUBSCRIBED');assert.equal((await join(sender)).status,'SUBSCRIBED');
  const positive=b.channel('academy-runtime:'+foreign,{config:{private:true}});assert.equal((await join(positive)).status,'SUBSCRIBED','Foreign account transport positive control failed');
  const unauthorized=b.channel(topic,{config:{private:true}});const denied=await join(unauthorized);assert.equal(denied.status,'CHANNEL_ERROR');assert.match(denied.error?.message??'',/unauthorized|do not have permissions|not authorized/i,'Transport failure is not authorization evidence');
  assert.equal(await sender.send({type:'broadcast',event:'academy-test',payload:{nonce}}),'ok');assert.deepEqual(await deadline(delivery),{nonce});
  console.log('Real Supabase SDK: signed upload path scope, signed download redemption/expiry, owner isolation, private channel delivery and foreign join denial passed. Publication NOT approved.');
 }finally{
  let cleanupFailed=false;
  try{if(path){const result=await a.storage.from(bucket).remove([path,otherPath]);if(result.error)cleanupFailed=true;}}catch{cleanupFailed=true;}
  for(const c of clients){try{await deadline(c.removeAllChannels(),5000);c.realtime.disconnect();}catch{cleanupFailed=true;}}
  assert.ok(!cleanupFailed,'Disposable Supabase cleanup failed; discard local stack');
 }
}
