/** Single-process, disposable teaching inbox. Not a production queue or a DB. */
import {createCipheriv,createDecipheriv,createHash,randomBytes,randomUUID,timingSafeEqual} from 'node:crypto';
import {closeSync,existsSync,fsyncSync,lstatSync,openSync,readFileSync,realpathSync,renameSync,unlinkSync,writeFileSync} from 'node:fs';
import {dirname,isAbsolute,resolve} from 'node:path';
import {signWebhook} from './labs.mjs';

const assert=(ok,code)=>{if(!ok)throw Error(code);};
const identifier=s=>typeof s==='string'&&/^[a-zA-Z0-9._:-]{1,100}$/.test(s);
const digest=body=>createHash('sha256').update(body).digest('hex');
const digestEqual=(a,b)=>typeof a==='string'&&/^[a-f0-9]{64}$/.test(a)&&timingSafeEqual(Buffer.from(a,'hex'),Buffer.from(b,'hex'));
const encrypt=(key,body,aad)=>{const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',key,iv);c.setAAD(Buffer.from(aad));const ciphertext=Buffer.concat([c.update(body),c.final()]);return {iv:iv.toString('base64url'),ciphertext:ciphertext.toString('base64url'),tag:c.getAuthTag().toString('base64url')};};
const decrypt=(key,row)=>{try{const iv=Buffer.from(row.iv,'base64url'),c=createDecipheriv('aes-256-gcm',key,iv);c.setAAD(Buffer.from(row.id));c.setAuthTag(Buffer.from(row.tag,'base64url'));const body=Buffer.concat([c.update(Buffer.from(row.ciphertext,'base64url')),c.final()]);assert(digestEqual(digest(body),row.digest),'corrupt-inbox');return body;}catch{throw Error('corrupt-inbox');}};
const copyMeta=row=>({id:row.id,provider:row.provider,tenantId:row.tenantId,eventId:row.eventId,status:row.status,attempts:row.attempts,leaseExpiresAt:row.leaseExpiresAt});

export class DurableWebhookInbox {
 #path;#key;#clock;#leaseMs;#maxEvents;#maxAttempts;#maxStoreBytes;#rows;#snapshot;
 constructor({filePath,encryptionKey,clock=()=>Date.now(),leaseMs=30_000,maxEvents=1000,maxAttempts=4,maxStoreBytes=16*1024*1024}){
  assert(typeof filePath==='string'&&isAbsolute(filePath),'invalid-store-path');
  assert(Buffer.isBuffer(encryptionKey)&&encryptionKey.length===32,'invalid-encryption-key');
  assert(Number.isSafeInteger(leaseMs)&&leaseMs>=100&&leaseMs<=300_000,'invalid-lease');
  assert(Number.isSafeInteger(maxEvents)&&maxEvents>=1&&maxEvents<=10_000,'invalid-capacity');
  assert(Number.isSafeInteger(maxAttempts)&&maxAttempts>=1&&maxAttempts<=20,'invalid-attempts');
  assert(Number.isSafeInteger(maxStoreBytes)&&maxStoreBytes>=512&&maxStoreBytes<=16*1024*1024,'invalid-store-limit');
  const dir=dirname(filePath),info=lstatSync(dir);
  assert(info.isDirectory()&&!info.isSymbolicLink()&&(info.mode&0o077)===0,'insecure-store-directory');
  assert(realpathSync(dir)===dir,'noncanonical-store-directory');
  this.#path=resolve(filePath);this.#key=Buffer.from(encryptionKey);this.#clock=clock;
  this.#leaseMs=leaseMs;this.#maxEvents=maxEvents;this.#maxAttempts=maxAttempts;this.#maxStoreBytes=maxStoreBytes;
  if(existsSync(filePath)){
   const st=lstatSync(filePath);
   assert(st.isFile()&&!st.isSymbolicLink()&&(st.mode&0o077)===0&&st.size<=maxStoreBytes,'insecure-store-file');
   let state;try{const saved=readFileSync(filePath);this.#snapshot=digest(saved);state=JSON.parse(saved.toString('utf8'));}catch{throw Error('corrupt-inbox');}
   assert(state?.version===1&&Array.isArray(state.rows)&&state.rows.length<=maxEvents,'corrupt-inbox');
   const entries=new Map();
   for(const row of state.rows){
    assert(row&&identifier(row.provider)&&identifier(row.tenantId)&&identifier(row.eventId)&&typeof row.id==='string'&&row.id===JSON.stringify([row.provider,row.tenantId,row.eventId])&&['pending','processing','processed','dead-letter'].includes(row.status)&&Number.isSafeInteger(row.attempts)&&row.attempts>=0&&row.attempts<=maxAttempts&&Number.isSafeInteger(row.leaseExpiresAt)&&typeof row.digest==='string','corrupt-inbox');
    assert(!entries.has(row.id),'corrupt-inbox');
    decrypt(this.#key,row); // Wrong key, corrupted ciphertext or forged metadata must fail startup.
    entries.set(row.id,row);
   }
   this.#rows=entries;
  }else {this.#rows=new Map();this.#snapshot=null;}
 }
 #persist(){
  // Optimistic stale-instance check: single process only; not a cross-process lock.
  const current=existsSync(this.#path)?digest(readFileSync(this.#path)):null;
  assert(current===this.#snapshot,'stale-inbox-snapshot');
  const tmp=this.#path+'.'+randomUUID()+'.tmp';let fd;
  try{
   const snapshot=JSON.stringify({version:1,rows:[...this.#rows.values()]});
   assert(Buffer.byteLength(snapshot)<=this.#maxStoreBytes,'inbox-storage-capacity');
   fd=openSync(tmp,'wx',0o600);writeFileSync(fd,snapshot);fsyncSync(fd);closeSync(fd);fd=undefined;
   renameSync(tmp,this.#path);this.#snapshot=digest(Buffer.from(snapshot));
   const d=openSync(dirname(this.#path),'r');try{fsyncSync(d);}finally{closeSync(d);}
  }catch(err){if(fd!==undefined)closeSync(fd);try{unlinkSync(tmp);}catch{}throw err;}
 }
 accept({provider,tenantId,eventId,body,timestamp,signature,secret,now=this.#clock()}){
  assert(identifier(provider)&&identifier(tenantId)&&identifier(eventId)&&typeof secret==='string'&&secret.length>=16,'invalid-webhook');
  assert(Buffer.isBuffer(body)&&body.length>0&&body.length<=64*1024,'invalid-body');
  assert(Number.isSafeInteger(timestamp)&&Number.isSafeInteger(now)&&Math.abs(now-timestamp)<=300_000,'stale-webhook');
  const expected=signWebhook(secret,body,timestamp,provider,eventId);
  assert(digestEqual(signature,expected),'invalid-signature');
  const id=JSON.stringify([provider,tenantId,eventId]),hash=digest(body),old=this.#rows.get(id);
  if(old){assert(digestEqual(old.digest,hash),'delivery-conflict');return {status:'duplicate',id};}
  assert(this.#rows.size<this.#maxEvents,'inbox-capacity');
  const row={id,provider,tenantId,eventId,digest:hash,status:'pending',attempts:0,leaseExpiresAt:0,leaseToken:null,...encrypt(this.#key,body,id)};
  this.#rows.set(id,row);try{this.#persist();}catch(err){this.#rows.delete(id);throw err;}
  return {status:'accepted',id};
 }
 claim(id){
  const row=this.#rows.get(id),now=this.#clock();
  if(!row||!['pending','processing'].includes(row.status)||row.status==='processing'&&row.leaseExpiresAt>now)return null;
  if(row.attempts>=this.#maxAttempts){row.status='dead-letter';row.leaseToken=null;this.#persist();return null;}
  const previous={...row};row.status='processing';row.attempts++;row.leaseExpiresAt=now+this.#leaseMs;row.leaseToken=randomUUID();
  try{this.#persist();}catch(err){this.#rows.set(id,previous);throw err;}
  return {...copyMeta(row),leaseToken:row.leaseToken,body:decrypt(this.#key,row)};
 }
 settle(id,ok,leaseToken){
  const row=this.#rows.get(id),now=this.#clock();
  assert(row?.status==='processing'&&typeof leaseToken==='string'&&leaseToken===row.leaseToken&&row.leaseExpiresAt>now,'stale-lease');
  const previous={...row};row.status=ok?'processed':row.attempts>=this.#maxAttempts?'dead-letter':'pending';row.leaseToken=null;row.leaseExpiresAt=0;
  try{this.#persist();}catch(err){this.#rows.set(id,previous);throw err;}
  return {status:row.status};
 }
 inspect(id){const row=this.#rows.get(id);return row?copyMeta(row):null;}
}
