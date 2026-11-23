/** Opt-in REAL PostgreSQL adapter qualification. Creates and removes a temporary
 * schema in a confirmed disposable local DB. Never run against production. */
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHmac,randomBytes,randomUUID} from 'node:crypto';
import {PostgresWebhookInbox} from './adapter.mjs';
import {validateInboxDb} from './qualify.mjs';
const schema=readFileSync(resolve(dirname(fileURLToPath(import.meta.url)),'schema.sql'),'utf8');
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
const safeText=s=>typeof s==='string'&&s.length>0;
export function validateLiveOptions(input={}){
 const errors=validateInboxDb({...input,run:input.run==='--run-live'?'--run':input.run});
 if(input.run!=='--run-live')errors.push('Explicit --run-live required');
 if(input.liveConfirm!=='ALLOW_TEMPORARY_SCHEMA')errors.push('Third confirmation for temporary CREATE/DROP required');
 return errors;
}
const sign=(secret,body,timestamp,provider,eventId)=>createHmac('sha256',secret).update(
 JSON.stringify(['p5-webhook-v2',provider,eventId,timestamp,body.toString('base64')])
).digest('hex');
export async function qualifyLive(input={}){
 const errors=validateLiveOptions(input);
 if(errors.length)throw Error(errors.join('; '));
 // The caller connects exclusively to a disposable loopback PostgreSQL database.
 // No root package dependency is introduced; install pg ONLY in a qualified lab.
 let Pool;
 try{({Pool}=await import('pg'));}catch{throw Error('Missing optional pg driver. Install pg locally for the opt-in live lab.');}
 const pool=new Pool({host:input.host??'127.0.0.1',port:Number(input.port??5432),database:input.db,
  user:input.user,password:input.password,connectionTimeoutMillis:5000,max:5});
 let created=false;
 try{
  const check=await pool.query(`SELECT current_database() AS db,
   current_setting('server_version_num')::integer AS version,
   pg_is_in_recovery() AS replica, r.rolsuper AS superuser,r.rolbypassrls AS bypass
   FROM pg_roles r WHERE r.rolname=current_user`);
  const role=check.rows[0];
  assert(check.rowCount===1&&role.db===input.db&&role.version>=170000&&!role.replica&&!role.superuser&&!role.bypass,'database-preflight-refused');
  const exists=await pool.query("SELECT 1 FROM pg_namespace WHERE nspname='p5_inbox_lab'");
  assert(exists.rowCount===0,'schema-already-exists-refusing-to-drop');
  const c=await pool.connect();
  try{
   await c.query('BEGIN');
   await c.query(schema); // Static, committed schema for multiple worker connections.
   await c.query('COMMIT');created=true;
  }catch(error){try{await c.query('ROLLBACK');}catch{}throw error;}
  finally{c.release();}
  const encryptionKey=randomBytes(32),secret='synthetic-p5-inbox-lab-secret-key';
  const options={pool,encryptionKey,webhookSecrets:{sender:secret},leaseMs:30000,maxAttempts:2};
  const north=new PostgresWebhookInbox({...options,tenantId:'north'});
  const south=new PostgresWebhookInbox({...options,tenantId:'south'});
  const id='event_'+randomUUID().replaceAll('-','').slice(0,20);
  const body=Buffer.from(JSON.stringify({event:'demo',id})),timestamp=Date.now();
  const signed={provider:'sender',eventId:id,body,timestamp,signature:sign(secret,body,timestamp,'sender',id)};
  assert((await north.accept(signed)).status==='accepted','accept-failed');
  assert((await north.accept(signed)).status==='duplicate','idempotency-failed');
  assert(await south.inspect({provider:'sender',eventId:id})===null,'cross-tenant-read-leaked');
  assert((await south.accept(signed)).status==='accepted','tenant-identity-collision');
  let conflict=false;
  const changed=Buffer.from('other bytes');
  try{await north.accept({...signed,body:changed,signature:sign(secret,changed,timestamp,'sender',id)});}catch(err){conflict=err.message==='delivery-conflict';}
  assert(conflict,'idempotency-conflict-not-rejected');
  const [a,b]=await Promise.all([north.claimNext(),north.claimNext()]);
  const winning=[a,b].filter(Boolean);
  assert(winning.length===1,'two-workers-claimed-same-event');
  assert(winning[0].body.equals(body),'decryption-mismatch');
  assert((await north.settle({provider:'sender',eventId:id,leaseToken:winning[0].leaseToken,ok:true})).status==='processed','settlement-failed');
  let stale=false;
  try{await north.settle({provider:'sender',eventId:id,leaseToken:winning[0].leaseToken,ok:true});}catch(e){stale=e.message==='stale-lease';}
  assert(stale,'lease-reuse-accepted');
  const southClaim=await south.claimNext();
  assert(southClaim?.tenantId==='south'&&southClaim.body.equals(body),'tenant-worker-scope-failed');
  assert((await south.settle({provider:'sender',eventId:id,leaseToken:southClaim.leaseToken,ok:false,retryable:false})).status==='dead-letter','dead-letter-failed');
  return {ok:true,mode:'real-disposable-db',assertions:11,db:input.db};
 }finally{
  try{if(created)await pool.query('DROP SCHEMA p5_inbox_lab CASCADE');}
  finally{await pool.end();}
 }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 qualifyLive({run:process.argv[2],db:process.env.P5_INBOX_DB,host:process.env.P5_INBOX_HOST,
  port:process.env.P5_INBOX_PORT??'5432',user:process.env.P5_INBOX_USER,
  password:process.env.P5_INBOX_PASSWORD,
  confirm:process.env.P5_INBOX_CONFIRM,confirmDb:process.env.P5_INBOX_CONFIRM_DB,
  liveConfirm:process.env.P5_INBOX_LIVE_CONFIRM})
 .then(r=>console.log(JSON.stringify(r)))
 .catch(e=>{console.error('Live lab blocked or failed:',e.message);process.exitCode=1;});
}
