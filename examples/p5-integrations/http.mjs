/**
 * Instructor-only, disposable loopback HTTP qualification.
 * No database, email sender, storage provider, or production identity.
 * Only construct with synthetic actors/secrets and listen on 127.0.0.1.
 */
import {createServer} from 'node:http';
import {createHmac, createHash, randomUUID, timingSafeEqual} from 'node:crypto';
import {
  inspectUpload, issueUploadToken, verifyUploadToken, assetReadAllowed,
  recordScan, MailOutbox, TenantSearch, WebhookInbox, signWebhook,
} from './labs.mjs';

const HEADER_SECURITY = Object.freeze({
 'cache-control':'no-store', 'content-security-policy':"default-src 'none'; frame-ancestors 'none'",
 'x-content-type-options':'nosniff', 'referrer-policy':'no-referrer', 'x-frame-options':'DENY',
});
const idOk = s => typeof s==='string' && s.length>0 && s.length<=100 && /^[a-zA-Z0-9._:-]+$/.test(s);
const FILE_TYPES = Object.freeze({png:'image/png',jpg:'image/jpeg',pdf:'application/pdf'});
const allowedUpload=(name,mime)=>typeof name==='string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,94}\.(png|jpg|pdf)$/i.test(name) && FILE_TYPES[name.split('.').at(-1).toLowerCase()]===mime;
const encode = data => Buffer.from(JSON.stringify(data)).toString('base64url');
const hmac = (secret,payload)=>createHmac('sha256',secret).update(payload).digest('hex');
const equalMac=(a,b)=>typeof a==='string' && /^[a-f0-9]{64}$/i.test(a) && timingSafeEqual(Buffer.from(a,'hex'),Buffer.from(b,'hex'));
const FAIL=(status,message)=>Object.assign(new Error(message),{status});
const reply=(res,status,body)=>{
 const json=JSON.stringify(body);
 res.writeHead(status,{'content-type':'application/json; charset=utf-8','content-length':Buffer.byteLength(json),...HEADER_SECURITY});
 res.end(json);
};
async function readBounded(req,limit){
 const buffers=[];let length=0,exceeded=false;
 for await(const chunk of req){length+=chunk.length;if(length>limit){exceeded=true;continue;}if(!exceeded)buffers.push(chunk);}
 if(exceeded)throw FAIL(413,'body-too-large');
 return Buffer.concat(buffers);
}
const readJson=async(req,limit=16_384)=>{
 if(req.headers['content-type']!=='application/json')throw FAIL(415,'json-required');
 const b=await readBounded(req,limit);
 if(!b.length)throw FAIL(400,'invalid-json');
 let d;try{d=JSON.parse(b.toString('utf8'));}catch{throw FAIL(400,'invalid-json');}
 if(!d||typeof d!=='object'||Array.isArray(d))throw FAIL(400,'invalid-json');
 return d;
};

export function createInstructorGateway({actors,secret,webhookBindings={},clock=()=>Date.now()}){
 if(!Array.isArray(actors)||!actors.length||!actors.every(a=>idOk(a.tenantId)&&idOk(a.userId)&&['viewer','editor'].includes(a.role)))throw Error('invalid-fixture-actors');
 if(typeof secret!=='string'||secret.length<32)throw Error('weak-fixture-secret');
 const identities=new Map(actors.map(a=>[`${a.tenantId}\u0000${a.userId}`,{...a}]));
 if(identities.size!==actors.length)throw Error('duplicate-fixture-actor');
 const revocations=new Set(), intents=new Map(), assets=new Map(), deliveries=new Map();
 const search=new TenantSearch(), outbox=new MailOutbox(clock), inbox=new WebhookInbox();
 let server,endpoint;

 const issueSession=({tenantId,userId,ttlMs=300_000})=>{
  const actor=identities.get(`${tenantId}\u0000${userId}`);
  if(!actor||!Number.isSafeInteger(ttlMs)||ttlMs<1||ttlMs>600_000)throw Error('invalid-fixture-session');
  const claims={tenantId,userId,iat:clock(),exp:clock()+ttlMs,jti:randomUUID()};
  const encoded=encode(claims);return `${encoded}.${hmac(secret,encoded)}`;
 };
 const authenticate=req=>{
  const bearer=req.headers.authorization;
  if(typeof bearer!=='string'||!bearer.startsWith('Bearer ')||bearer.length>3000)throw FAIL(401,'unauthorized');
  const token=bearer.slice(7), parts=token.split('.');
  if(parts.length!==2||!equalMac(parts[1],hmac(secret,parts[0])))throw FAIL(401,'unauthorized');
  let c;try{c=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));}catch{throw FAIL(401,'unauthorized');}
  if(!c||!idOk(c.tenantId)||!idOk(c.userId)||typeof c.jti!=='string'||
    !Number.isSafeInteger(c.iat)||!Number.isSafeInteger(c.exp)||c.iat>clock()||
    c.exp<=clock()||c.exp-c.iat>600_000||revocations.has(c.jti))throw FAIL(401,'unauthorized');
  const actor=identities.get(`${c.tenantId}\u0000${c.userId}`);
  if(!actor||actor.suspended===true)throw FAIL(401,'unauthorized');
  return {actor,jti:c.jti};
 };
 const requireEditor=actor=>{if(actor.role!=='editor')throw FAIL(403,'forbidden');};
 const requireOrigin=req=>{if(req.headers.origin!==endpoint)throw FAIL(403,'origin-denied');};
 const assertLocal=req=>{
  const expected=`127.0.0.1:${server.address().port}`;
  if(req.headers.host!==expected||!req.url?.startsWith('/')||req.url.startsWith('//')||req.url.includes('\\'))throw FAIL(400,'invalid-request-target');
 };
 const service = createServer(async(req,res)=>{
  try{
   assertLocal(req);
   const url=new URL(req.url,endpoint);
   if(url.origin!==endpoint||url.username||url.password)throw FAIL(400,'invalid-request-target');
   const route=url.pathname;
   if(req.method==='GET'&&route==='/health')return reply(res,200,{ok:true,scope:'synthetic-loopback'});
   if(req.method==='POST'&&route==='/webhooks'){
    // Webhook actor is derived from an instructor-owned provider binding, NOT a caller's tenant header.
    const provider=req.headers['x-lab-provider'],eventId=req.headers['x-lab-event-id'];
    const binding=Object.hasOwn(webhookBindings,provider)?webhookBindings[provider]:null;
    if(!binding||!idOk(eventId)||typeof binding.secret!=='string'||binding.secret.length<32||!idOk(binding.tenantId))throw FAIL(401,'unauthorized');
    if(req.headers['content-type']!=='application/json')throw FAIL(415,'json-required');
    const timestamp=Number(req.headers['x-lab-timestamp']);
    if(!Number.isSafeInteger(timestamp)||Math.abs(clock()-timestamp)>300_000)throw FAIL(401,'unauthorized');
    const body=await readBounded(req,64*1024);
    const signature=req.headers['x-lab-signature'];
    if(!body.length||!equalMac(signature,signWebhook(binding.secret,body,timestamp)))throw FAIL(401,'unauthorized');
    const key=JSON.stringify([provider,binding.tenantId,eventId]);
    const digest=createHash('sha256').update(body).digest('hex');
    const old=deliveries.get(key);
    if(old&&old!==digest)throw FAIL(409,'delivery-conflict');
    const receipt=inbox.accept({provider,tenantId:binding.tenantId,eventId,body,timestamp,signature,secret:binding.secret,now:clock()});
    deliveries.set(key,digest);
    return reply(res,receipt.status==='accepted'?202:200,{status:receipt.status});
   }
   const {actor,jti}=authenticate(req);
   if(['POST','PUT','PATCH','DELETE'].includes(req.method))requireOrigin(req);
   if(req.method==='POST'&&route==='/logout'){
    await readBounded(req,0);revocations.add(jti);return reply(res,200,{signedOut:true});
   }
   if(req.method==='POST'&&route==='/upload-intents'){
    requireEditor(actor);
    const input=await readJson(req);
    if(!allowedUpload(input.filename,input.contentType))throw FAIL(422,'invalid-upload-intent');
    for(const [nonce,item] of intents)if(item.expiresAt<=clock())intents.delete(nonce);
    if(intents.size>=128)throw FAIL(429,'too-many-intents');
    const token=issueUploadToken(secret,{tenantId:actor.tenantId,userId:actor.userId,filename:input.filename,now:clock(),ttlMs:60_000});
    const claims=verifyUploadToken(secret,token,{tenantId:actor.tenantId,userId:actor.userId,now:clock()});
    intents.set(claims.nonce,{contentType:input.contentType,used:false,expiresAt:claims.exp});
    return reply(res,201,{token,expiresAt:claims.exp});
   }
   if(req.method==='PUT'&&route==='/uploads'){
    requireEditor(actor);
    if(req.headers['content-type']!=='application/octet-stream')throw FAIL(415,'binary-required');
    let claims;try{claims=verifyUploadToken(secret,req.headers['x-lab-upload-token'],{tenantId:actor.tenantId,userId:actor.userId,now:clock()});}catch{throw FAIL(403,'invalid-upload-token');}
    const intent=intents.get(claims.nonce);
    if(!intent||intent.used)throw FAIL(409,'consumed-intent');
    intent.used=true; // consumed before parsing; reusing the same signed intent is never permitted
    const body=await readBounded(req,512*1024);
    let checked;try{checked=inspectUpload({filename:claims.filename,declaredType:intent.contentType,bytes:body,maxBytes:512*1024});}
    catch{throw FAIL(422,'invalid-upload');}
    if(assets.size>=256)throw FAIL(429,'asset-capacity');
    const id=randomUUID();assets.set(id,{id,tenantId:actor.tenantId,ownerId:actor.userId,status:'quarantined',...checked,sha256:createHash('sha256').update(body).digest('hex')});
    return reply(res,201,{assetId:id,status:'quarantined'});
   }
   if(req.method==='GET'&&route.startsWith('/assets/')){
    const id=route.slice('/assets/'.length);
    if(!/^[a-f0-9-]{36}$/.test(id))throw FAIL(404,'not-found');
    const asset=assets.get(id);
    if(!assetReadAllowed(asset,actor))throw FAIL(404,'not-found');
    const {id:assetId,filename,size,contentType,sha256}=asset;
    return reply(res,200,{assetId,filename,size,contentType,sha256});
   }
   if(req.method==='POST'&&route==='/search/documents'){
    requireEditor(actor);const d=await readJson(req);
    if(!idOk(d.id)||typeof d.title!=='string'||d.title.length>160||typeof d.body!=='string'||d.body.length>2000||!Number.isSafeInteger(d.version)||d.version<1)throw FAIL(422,'invalid-document');
    const updated=search.upsert({tenantId:actor.tenantId,id:d.id,title:d.title,body:d.body,version:d.version,status:d.status??'visible'});
    return reply(res,updated?201:200,{updated});
   }
   if(req.method==='GET'&&route==='/search'){
    const phrase=url.searchParams.get('q')??'',limit=Number(url.searchParams.get('limit')??10),signedCursor=url.searchParams.get('cursor');
    let cursor=null;
    if(signedCursor){
     const parts=signedCursor.split('.');
     if(parts.length!==2||parts[0].length>512||!equalMac(parts[1],hmac(secret,parts[0])))throw FAIL(422,'invalid-search');
     let value;try{value=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));}catch{throw FAIL(422,'invalid-search');}
     if(value?.userId!==actor.userId||value?.tenantId!==actor.tenantId||typeof value?.cursor!=='string')throw FAIL(422,'invalid-search');
     cursor=value.cursor;
    }
    try{const result=search.query({tenantId:actor.tenantId,phrase,limit,cursor});
      if(result.next){const payload=encode({cursor:result.next,tenantId:actor.tenantId,userId:actor.userId});result.next=`${payload}.${hmac(secret,payload)}`;}
      return reply(res,200,result);}
    catch{throw FAIL(422,'invalid-search');}
   }
   if(req.method==='POST'&&route==='/mail'){
    requireEditor(actor);const d=await readJson(req);
    if(!idOk(d.key)||!idOk(d.template)||!['transactional','marketing'].includes(d.kind)||!d.payload||typeof d.payload!=='object'||Array.isArray(d.payload))throw FAIL(422,'invalid-mail');
    let job;try{job=outbox.enqueue({tenantId:actor.tenantId,userId:actor.userId,key:d.key,template:d.template,kind:d.kind,payload:d.payload});}
    catch{throw FAIL(409,'idempotency-conflict');}
    return reply(res,job.status==='suppressed'?200:202,{status:job.status,id:job.id??null});
   }
   if(req.method==='GET'&&route==='/mail'){
    const id=url.searchParams.get('id');const job=outbox.get(id,{tenantId:actor.tenantId,userId:actor.userId});
    if(!job)throw FAIL(404,'not-found');
    return reply(res,200,{id:job.id,status:job.status,attempts:job.attempts});
   }
   throw FAIL(404,'not-found');
  }catch(err){
   if(!res.headersSent)reply(res,err?.status??500,{error:err?.status?err.message:'internal-error'});
   else res.destroy();
  }
 });
 server=service;
 const start=()=>new Promise((resolve,reject)=>{
  server.once('error',reject);
  server.listen(0,'127.0.0.1',()=>{server.off('error',reject);endpoint=`http://127.0.0.1:${server.address().port}`;resolve(endpoint);});
 });
 const stop=()=>new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()));
 const markScan=(id,outcome)=>{const a=assets.get(id);if(!a)throw Error('unknown-instructor-asset');assets.set(id,recordScan(a,outcome));};
 const setConsent=(tenantId,userId,enabled)=>{if(!identities.has(`${tenantId}\u0000${userId}`))throw Error('unknown-instructor-actor');outbox.setMarketingConsent(tenantId,userId,enabled);};
 return Object.freeze({start,stop,issueSession,markScan,setConsent,claimMail:id=>outbox.claim(id),settleMail:(id,result)=>outbox.settle(id,result),claimWebhook:id=>inbox.claim(id),settleWebhook:(id,ok)=>inbox.settle(id,ok)});
}
