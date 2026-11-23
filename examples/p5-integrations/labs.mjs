/** Synthetic, process-local instructor exercises. Not a storage, mail or search provider. */
import {createHmac, randomUUID, timingSafeEqual} from 'node:crypto';

const nonempty = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 160;
const insist = (predicate, code) => { if (!predicate) throw new Error(code); };
const raw = v => Buffer.isBuffer(v) ? v : Buffer.from(v);
const mac = (key, value) => createHmac('sha256', key).update(value).digest('hex');
const sameHex = (a,b) => /^[0-9a-f]{64}$/i.test(a) && /^[0-9a-f]{64}$/i.test(b) && timingSafeEqual(Buffer.from(a,'hex'),Buffer.from(b,'hex'));
const TYPES = Object.freeze({
 '.png': {type:'image/png',signature:Buffer.from('89504e470d0a1a0a','hex')},
 '.jpg': {type:'image/jpeg',signature:Buffer.from('ffd8ff','hex')},
 '.pdf': {type:'application/pdf',signature:Buffer.from('%PDF-')},
});
export function inspectUpload({filename,declaredType,bytes,maxBytes=5*1024*1024}) {
 insist(nonempty(filename) && !/[\\/\x00-\x1f]/.test(filename) && !/^\./.test(filename),'invalid-filename');
 const ext=filename.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase();
 insist(Object.hasOwn(TYPES,ext),'unsupported-type');
 insist(Buffer.isBuffer(bytes) && bytes.length>0 && bytes.length<=maxBytes,'invalid-size');
 const expected=TYPES[ext];
 insist(declaredType===expected.type,'mime-mismatch');
 insist(bytes.subarray(0,expected.signature.length).equals(expected.signature),'signature-mismatch');
 return Object.freeze({filename,contentType:expected.type,size:bytes.length});
}
export function issueUploadToken(secret,{tenantId,userId,filename,now=Date.now(),ttlMs=60_000}) {
 insist(nonempty(secret) && nonempty(tenantId) && nonempty(userId),'invalid-identity');
 insist(nonempty(filename) && !/[\\/\x00-\x1f]/.test(filename),'invalid-filename');
 insist(Number.isSafeInteger(now) && Number.isSafeInteger(ttlMs) && ttlMs>0 && ttlMs<=300_000,'invalid-expiry');
 const claims={tenantId,userId,filename,nonce:randomUUID(),exp:now+ttlMs};
 const payload=Buffer.from(JSON.stringify(claims)).toString('base64url');
 return `${payload}.${mac(secret,payload)}`;
}
export function verifyUploadToken(secret,token,{tenantId,userId,now=Date.now()}) {
 insist(nonempty(secret) && nonempty(tenantId) && nonempty(userId),'invalid-identity');
 insist(typeof token==='string' && token.length<=2048,'invalid-token');
 const parts=token.split('.');
 insist(parts.length===2 && /^[A-Za-z0-9_-]+$/.test(parts[0]) && sameHex(parts[1],mac(secret,parts[0])),'invalid-token');
 let claims;
 try { claims=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8')); } catch { throw new Error('invalid-token'); }
 insist(claims?.tenantId===tenantId && claims?.userId===userId,'forbidden');
 insist(Number.isSafeInteger(claims.exp) && now<claims.exp && now>=claims.exp-300_000,'expired');
 insist(nonempty(claims.filename) && nonempty(claims.nonce),'invalid-token');
 return claims;
}
export function assetReadAllowed(asset,{tenantId,userId}) {
 return Boolean(asset && asset.tenantId===tenantId && asset.ownerId===userId && asset.status==='clean');
}
export function recordScan(asset,outcome) {
 insist(asset?.status==='quarantined' && ['clean','malicious','failed'].includes(outcome),'invalid-scan');
 return {...asset,status:outcome==='clean'?'clean':'blocked'};
}

export class MailOutbox {
 #jobs=new Map(); #consent=new Map(); #clock;
 constructor(clock=()=>Date.now()){this.#clock=clock;}
 setMarketingConsent(tenantId,userId,optIn){insist(nonempty(tenantId)&&nonempty(userId),'invalid-identity');this.#consent.set(`${tenantId}\0${userId}`,optIn===true);}
 enqueue({tenantId,userId,key,kind='transactional',template,payload={}}){
  insist([tenantId,userId,key,template].every(nonempty),'invalid-job');
  insist(['transactional','marketing'].includes(kind),'invalid-kind');
  insist(payload && typeof payload==='object' && !Array.isArray(payload),'invalid-payload');
  if(kind==='marketing' && this.#consent.get(`${tenantId}\0${userId}`)!==true)return {status:'suppressed'};
  const id=JSON.stringify([tenantId,userId,key]);
  const existing=this.#jobs.get(id);
  if(existing){insist(existing.template===template && existing.kind===kind,'idempotency-conflict');return {...existing};}
  const job={id,tenantId,userId,kind,template,payload:structuredClone(payload),status:'pending',attempts:0,nextAt:this.#clock()};
  this.#jobs.set(id,job);return {...job};
 }
 claim(id){const job=this.#jobs.get(id);if(!job||job.status!=='pending'||job.nextAt>this.#clock())return null;
  if(job.kind==='marketing' && this.#consent.get(`${job.tenantId}\0${job.userId}`)!==true){job.status='suppressed';return null;}
  job.status='sending';job.attempts++;return {...job};}
 settle(id,{success,retryable=false}){const job=this.#jobs.get(id);insist(job?.status==='sending','not-inflight');
  if(success)job.status='sent';else if(retryable && job.attempts<3){job.status='pending';job.nextAt=this.#clock()+1000*2**(job.attempts-1);}else job.status='dead-letter';
  return {...job};}
 get(id,{tenantId,userId}){const job=this.#jobs.get(id);return job?.tenantId===tenantId&&job?.userId===userId?{...job}:null;}
}

export class TenantSearch {
 #docs=new Map(); #revision=0;
 upsert({tenantId,id,title,body='',status='visible',version}){
  insist([tenantId,id,title].every(nonempty) && ['visible','hidden'].includes(status),'invalid-document');
  insist(typeof body==='string' && Number.isSafeInteger(version) && version>0,'invalid-document');
  const key=JSON.stringify([tenantId,id]);const previous=this.#docs.get(key);
  if(previous && version<=previous.version)return false;
  this.#docs.set(key,{tenantId,id,title,body,status,version});this.#revision++;return true;
 }
 remove({tenantId,id,version}){
  insist(nonempty(tenantId)&&nonempty(id)&&Number.isSafeInteger(version),'invalid-document');
  const key=JSON.stringify([tenantId,id]);const previous=this.#docs.get(key);
  if(!previous||version<=previous.version)return false;
  this.#docs.set(key,{...previous,status:'hidden',version});this.#revision++;return true;
 }
 query({tenantId,phrase='',limit=10,cursor=null}){
  insist(nonempty(tenantId)&&typeof phrase==='string'&&phrase.length<=100,'invalid-query');
  insist(Number.isSafeInteger(limit)&&limit>=1&&limit<=25,'invalid-limit');
  const query=phrase.toLocaleLowerCase('en').trim();
  let offset=0;
  if(cursor){let c;try{c=JSON.parse(Buffer.from(cursor,'base64url').toString('utf8'));}catch{throw new Error('invalid-cursor');}
   insist(c?.tenantId===tenantId && c?.query===query && c?.revision===this.#revision && Number.isSafeInteger(c?.offset) && c.offset>=0,'stale-or-foreign-cursor');offset=c.offset;}
  const scored=[...this.#docs.values()].filter(d=>d.tenantId===tenantId&&d.status==='visible').map(d=>{
    const t=d.title.toLocaleLowerCase('en'),b=d.body.toLocaleLowerCase('en');
    const score=!query?1:(t.includes(query)?4:0)+(b.includes(query)?1:0);
    return {...d,score};
  }).filter(d=>d.score>0).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  const page=scored.slice(offset,offset+limit).map(({body,score,...d})=>({...d,score}));
  const next=offset+limit<scored.length?Buffer.from(JSON.stringify({tenantId,query,revision:this.#revision,offset:offset+limit})).toString('base64url'):null;
  return {items:page,next,total:scored.length};
 }
}

export function signWebhook(secret,body,timestamp){insist(nonempty(secret)&&Number.isSafeInteger(timestamp),'invalid-webhook');return mac(secret,`${timestamp}.`+raw(body).toString('base64'));}
export class WebhookInbox {
 #events=new Map();
 accept({provider,tenantId,eventId,body,timestamp,signature,secret,now=Date.now()}){
  insist([provider,tenantId,eventId,secret].every(nonempty),'invalid-webhook');
  insist(Buffer.isBuffer(body) && body.length>0 && body.length<=64*1024,'invalid-body');
  insist(Number.isSafeInteger(now)&&Number.isSafeInteger(timestamp)&&Math.abs(now-timestamp)<=300_000,'stale-webhook');
  insist(typeof signature==='string' && sameHex(signature,signWebhook(secret,body,timestamp)),'invalid-signature');
  const id=JSON.stringify([provider,tenantId,eventId]);
  if(this.#events.has(id))return {status:'duplicate',id};
  const record={id,provider,tenantId,eventId,status:'pending',body:Buffer.from(body)};
  this.#events.set(id,record);return {status:'accepted',id};
 }
 claim(id){const e=this.#events.get(id);if(e?.status!=='pending')return null;e.status='processing';return {...e,body:Buffer.from(e.body)};}
 settle(id,ok){const e=this.#events.get(id);insist(e?.status==='processing','invalid-transition');e.status=ok?'processed':'pending';return {status:e.status};}
}
