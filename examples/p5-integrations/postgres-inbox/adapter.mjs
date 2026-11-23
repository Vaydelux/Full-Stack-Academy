/** Opt-in PostgreSQL teaching adapter; no network or driver dependency at import time.
 * A trusted server injects a pg-compatible pool; DO NOT expose the pool to learners.
 * The runtime SQL user must be non-superuser, non-BYPASSRLS and have RLS enabled.
 */
import {createCipheriv,createDecipheriv,createHash,randomBytes,randomUUID,timingSafeEqual,createHmac} from 'node:crypto';

const validId=s=>typeof s==='string' && /^[a-zA-Z0-9._:-]{1,100}$/.test(s);
const insist=(condition,code)=>{if(!condition)throw Error(code);};
const hash=body=>createHash('sha256').update(body).digest('hex');
const mac=(secret,body,timestamp,provider,eventId)=>createHmac('sha256',secret).update(
 JSON.stringify(['p5-webhook-v2',provider,eventId,timestamp,body.toString('base64')])
).digest('hex');
const equalHash=(a,b)=>typeof a==='string' && /^[a-f0-9]{64}$/i.test(a) &&
 typeof b==='string' && /^[a-f0-9]{64}$/i.test(b) &&
 timingSafeEqual(Buffer.from(a,'hex'),Buffer.from(b,'hex'));
const aad=(tenantId,provider,eventId)=>Buffer.from(JSON.stringify([tenantId,provider,eventId]));

const encrypt=(key,body,tenantId,provider,eventId)=>{
 const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);
 cipher.setAAD(aad(tenantId,provider,eventId));
 return {iv,encryptedBody:Buffer.concat([cipher.update(body),cipher.final()]),tag:cipher.getAuthTag()};
};
const decrypt=(key,row)=>{
 try{
  const iv=Buffer.from(row.iv),tag=Buffer.from(row.auth_tag),encrypted=Buffer.from(row.encrypted_body);
  insist(iv.length===12&&tag.length===16,'corrupt-payload');
  const decipher=createDecipheriv('aes-256-gcm',key,iv);
  decipher.setAAD(aad(row.tenant_id,row.provider,row.event_id));decipher.setAuthTag(tag);
  const body=Buffer.concat([decipher.update(encrypted),decipher.final()]);
  insist(equalHash(hash(body),row.payload_digest),'corrupt-payload');
  return body;
 }catch{throw Error('corrupt-payload');}
};
const rowId=row=>JSON.stringify([row.provider,row.tenant_id,row.event_id]);
const publicMeta=row=>({id:rowId(row),provider:row.provider,tenantId:row.tenant_id,
 eventId:row.event_id,status:row.state,attempts:row.attempts});

// Static SQL; every value is a parameter. No caller-supplied SQL identifier, schema or table.
export const SQL=Object.freeze({
 context:`SELECT set_config('p5.tenant_id', $1, true)`,
 insert:`INSERT INTO p5_inbox_lab.deliveries
  (tenant_id,provider,event_id,payload_digest,encrypted_body,iv,auth_tag)
  VALUES ($1,$2,$3,$4,$5,$6,$7)
  ON CONFLICT (tenant_id,provider,event_id) DO NOTHING RETURNING tenant_id,provider,event_id`,
 duplicate:`SELECT payload_digest FROM p5_inbox_lab.deliveries
  WHERE tenant_id=$1 AND provider=$2 AND event_id=$3 FOR UPDATE`,
 expire:`UPDATE p5_inbox_lab.deliveries SET state='dead-letter',lease_token=NULL,
  lease_expires_at=NULL,updated_at=clock_timestamp()
  WHERE tenant_id=$1 AND state='processing' AND lease_expires_at <= clock_timestamp()
  AND attempts >= $2`,
 candidate:`SELECT tenant_id,provider,event_id FROM p5_inbox_lab.deliveries
  WHERE tenant_id=$1 AND attempts < $2 AND (
   (state='pending' AND next_at <= clock_timestamp()) OR
   (state='processing' AND lease_expires_at <= clock_timestamp()))
  ORDER BY next_at,created_at,provider,event_id
  FOR UPDATE SKIP LOCKED LIMIT 1`,
 claim:`UPDATE p5_inbox_lab.deliveries SET state='processing',attempts=attempts+1,
  lease_token=$4::uuid,lease_expires_at=clock_timestamp()+($5::integer * interval '1 millisecond'),
  updated_at=clock_timestamp()
  WHERE tenant_id=$1 AND provider=$2 AND event_id=$3
  RETURNING tenant_id,provider,event_id,payload_digest,encrypted_body,iv,auth_tag,
   state,attempts,lease_token,lease_expires_at`,
 settle:`UPDATE p5_inbox_lab.deliveries
  SET state=CASE WHEN $5::boolean THEN 'processed'
             WHEN attempts >= $6::integer OR NOT $7::boolean THEN 'dead-letter'
             ELSE 'pending' END,
      next_at=CASE WHEN $5::boolean THEN next_at ELSE
        clock_timestamp()+(LEAST(60000,1000 * power(2,LEAST(attempts-1,6))) * interval '1 millisecond') END,
      lease_token=NULL,lease_expires_at=NULL,updated_at=clock_timestamp()
  WHERE tenant_id=$1 AND provider=$2 AND event_id=$3
   AND lease_token=$4::uuid AND state='processing'
   AND lease_expires_at>clock_timestamp()
  RETURNING tenant_id,provider,event_id,state,attempts`,
 inspect:`SELECT tenant_id,provider,event_id,state,attempts FROM p5_inbox_lab.deliveries
  WHERE tenant_id=$1 AND provider=$2 AND event_id=$3`,
});

export class PostgresWebhookInbox {
 #pool;#tenantId;#key;#secrets;#clock;#maxAttempts;#leaseMs;
 constructor({pool,tenantId,encryptionKey,webhookSecrets,clock=()=>Date.now(),maxAttempts=4,leaseMs=30_000}){
  insist(pool && typeof pool.connect==='function','invalid-pool');
  insist(validId(tenantId),'invalid-tenant');
  insist(Buffer.isBuffer(encryptionKey)&&encryptionKey.length===32,'invalid-encryption-key');
  insist(webhookSecrets && typeof webhookSecrets==='object' && !Array.isArray(webhookSecrets),'invalid-webhook-binding');
  insist(Object.entries(webhookSecrets).length>0 && Object.entries(webhookSecrets).every(([p,s])=>validId(p)&&typeof s==='string'&&s.length>=16),'invalid-webhook-binding');
  insist(typeof clock==='function','invalid-clock');
  insist(Number.isInteger(maxAttempts)&&maxAttempts>=1&&maxAttempts<=20,'invalid-attempts');
  insist(Number.isInteger(leaseMs)&&leaseMs>=100&&leaseMs<=300_000,'invalid-lease');
  this.#pool=pool;this.#tenantId=tenantId;this.#key=Buffer.from(encryptionKey);
  this.#secrets=Object.freeze({...webhookSecrets});this.#clock=clock;
  this.#maxAttempts=maxAttempts;this.#leaseMs=leaseMs;
 }
 async #transaction(action){
  const client=await this.#pool.connect();
  insist(client&&typeof client.query==='function'&&typeof client.release==='function','invalid-client');
  let begun=false,discard=false;
  try{
   await client.query('BEGIN');begun=true;
   await client.query(SQL.context,[this.#tenantId]);
   const result=await action(client);
   try{await client.query('COMMIT');}
   catch(error){
    // Commit may have succeeded even when its acknowledgement was lost.
    // NEVER blindly retry an external side effect or return this client to pool.
    discard=true;begun=false;
    throw Error('db-commit-uncertain',{cause:error});
   }
   begun=false;
   return result;
  }catch(error){
   if(begun){try{await client.query('ROLLBACK');}
    catch{discard=true;throw Error('db-rollback-uncertain',{cause:error});}}
   throw error;
  }finally{client.release(discard);}
 }
 async accept({provider,eventId,body,timestamp,signature}){
  insist(validId(provider)&&validId(eventId),'invalid-webhook');
  insist(Object.hasOwn(this.#secrets,provider),'unregistered-provider');
  insist(Buffer.isBuffer(body)&&body.length>0&&body.length<=64*1024,'invalid-body');
  const now=this.#clock();
  insist(Number.isSafeInteger(timestamp)&&Number.isSafeInteger(now)&&Math.abs(now-timestamp)<=300_000,'stale-webhook');
  insist(equalHash(signature,mac(this.#secrets[provider],body,timestamp,provider,eventId)),'invalid-signature');
  const encrypted=encrypt(this.#key,body,this.#tenantId,provider,eventId);
  const digest=hash(body);
  return this.#transaction(async client=>{
   const inserted=await client.query(SQL.insert,[this.#tenantId,provider,eventId,digest,encrypted.encryptedBody,encrypted.iv,encrypted.tag]);
   if(inserted.rowCount===1)return {status:'accepted',id:JSON.stringify([provider,this.#tenantId,eventId])};
   insist(inserted.rowCount===0,'invalid-insert-result');
   const existing=await client.query(SQL.duplicate,[this.#tenantId,provider,eventId]);
   insist(existing.rowCount===1,'missing-conflicting-delivery');
   insist(equalHash(existing.rows[0].payload_digest,digest),'delivery-conflict');
   return {status:'duplicate',id:JSON.stringify([provider,this.#tenantId,eventId])};
  });
 }
 async claimNext(){
  return this.#transaction(async client=>{
   await client.query(SQL.expire,[this.#tenantId,this.#maxAttempts]);
   const candidate=await client.query(SQL.candidate,[this.#tenantId,this.#maxAttempts]);
   if(candidate.rowCount===0)return null;
   insist(candidate.rowCount===1,'invalid-candidate');
   const c=candidate.rows[0],leaseToken=randomUUID();
   const claimed=await client.query(SQL.claim,[this.#tenantId,c.provider,c.event_id,leaseToken,this.#leaseMs]);
   insist(claimed.rowCount===1,'claim-lost');
   const r=claimed.rows[0];
   const body=decrypt(this.#key,r);
   return {...publicMeta(r),leaseToken,body};
  });
 }
 async settle({provider,eventId,leaseToken,ok,retryable=true}){
  insist(validId(provider)&&validId(eventId),'invalid-delivery');
  insist(typeof leaseToken==='string'&&/^[a-f0-9-]{36}$/i.test(leaseToken),'invalid-lease-token');
  insist(typeof ok==='boolean'&&typeof retryable==='boolean','invalid-outcome');
  return this.#transaction(async client=>{
   const res=await client.query(SQL.settle,[this.#tenantId,provider,eventId,leaseToken,ok,this.#maxAttempts,retryable]);
   insist(res.rowCount===1,'stale-lease');
   return {status:res.rows[0].state};
  });
 }
 async inspect({provider,eventId}){
  insist(validId(provider)&&validId(eventId),'invalid-delivery');
  return this.#transaction(async client=>{
   const res=await client.query(SQL.inspect,[this.#tenantId,provider,eventId]);
   return res.rowCount===1?publicMeta(res.rows[0]):null;
  });
 }
}
