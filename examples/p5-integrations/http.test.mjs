import test from 'node:test';
import assert from 'node:assert/strict';
import {request as rawRequest} from 'node:http';
import {createInstructorGateway} from './http.mjs';
import {signWebhook} from './labs.mjs';

const S='a-strong-synthetic-gateway-secret-1234567890-test';
const P='a-long-synthetic-provider-secret-1234567890';
const PNG=Buffer.from('89504e470d0a1a0a001122','hex');
const PDF=Buffer.from('%PDF-1.7\n');
const setup=async(t,{clock=()=>1_000_000,actors}={})=>{
 const gw=createInstructorGateway({secret:S,clock,webhookBindings:{provider:{tenantId:'north',secret:P},another:{tenantId:'south',secret:P}},actors:actors??[
  {tenantId:'north',userId:'alice',role:'editor'},
  {tenantId:'north',userId:'bob',role:'viewer'},
  {tenantId:'north',userId:'mary',role:'editor'},
  {tenantId:'south',userId:'carol',role:'editor'},
 ]});
 const origin=await gw.start();t.after(()=>gw.stop());
 const tokens={alice:gw.issueSession({tenantId:'north',userId:'alice'}),bob:gw.issueSession({tenantId:'north',userId:'bob'}),mary:gw.issueSession({tenantId:'north',userId:'mary'}),carol:gw.issueSession({tenantId:'south',userId:'carol'})};
 const send=async(path,{who='alice',method='GET',body,headers={},originHeader=true}={})=>{
  const h={...headers};if(who)h.authorization=`Bearer ${tokens[who]}`;
  if(method!=='GET'&&method!=='HEAD'&&originHeader)h.origin??=origin;
  if(body!==undefined&&!Buffer.isBuffer(body)&&typeof body!=='string'){h['content-type']??='application/json';body=JSON.stringify(body);}
  const r=await fetch(origin+path,{method,headers:h,body,redirect:'manual'});
  let data;try{data=await r.json();}catch{data=null;}
  return {status:r.status,body:data,headers:r.headers};
 };
 return {gw,origin,tokens,send};
};
const intent=async(s,filename='photo.png',contentType='image/png',who='alice')=>{
 const x=await s.send('/upload-intents',{method:'POST',who,body:{filename,contentType}});assert.equal(x.status,201);return x.body.token;
};
const upload=async(s,token,body=PNG,who='alice')=>s.send('/uploads',{method:'PUT',who,body,headers:{'content-type':'application/octet-stream','x-lab-upload-token':token}});
const sign=({provider='provider',eventId='event-1',body=Buffer.from('{"ok":true}'),ts=1_000_000,secret=P}={})=>({
 method:'POST',who:null,body,headers:{'content-type':'application/json','x-lab-provider':provider,'x-lab-event-id':eventId,'x-lab-timestamp':String(ts),'x-lab-signature':signWebhook(secret,body,ts)},originHeader:false
});
const upsert=(id,title='Morning report',version=1,who='alice',status='visible',body='notes')=>({method:'POST',who,body:{id,title,body,status,version}});
const email=(key,kind='transactional',template='receipt',payload={amount:5},who='alice')=>({method:'POST',who,body:{key,kind,template,payload}});

// Real socket, raw HTTP and Web Fetch requests. No fake req/res objects.
test('gateway fixture refuses weak keys',()=>assert.throws(()=>createInstructorGateway({actors:[{tenantId:'n',userId:'u',role:'viewer'}],secret:'short'}),/weak-fixture-secret/));
test('gateway fixture rejects duplicate actors',()=>assert.throws(()=>createInstructorGateway({secret:S,actors:[{tenantId:'n',userId:'u',role:'viewer'},{tenantId:'n',userId:'u',role:'viewer'}]}),/duplicate-fixture-actor/));
test('gateway starts only on loopback and advertises no store',async t=>{const s=await setup(t);const x=await s.send('/health',{who:null});assert.equal(x.status,200);assert.equal(x.body.scope,'synthetic-loopback');assert.equal(x.headers.get('cache-control'),'no-store');assert.equal(x.headers.get('x-content-type-options'),'nosniff');assert.match(s.origin,/^http:\/\/127\.0\.0\.1:/);});
test('raw HTTP Host spoofing is rejected before authentication',async t=>{const s=await setup(t);const u=new URL(s.origin);const r=await new Promise((resolve,reject)=>{const req=rawRequest({hostname:'127.0.0.1',port:u.port,path:'/health',headers:{host:'remote.example'}},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});req.on('error',reject);req.end();});assert.equal(r,400);});
test('absolute-form request-target blocked',async t=>{const s=await setup(t);const u=new URL(s.origin);const r=await new Promise((resolve,reject)=>{const req=rawRequest({hostname:'127.0.0.1',port:u.port,path:'http://external.invalid/health'},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});req.on('error',reject);req.end();});assert.equal(r,400);});
test('health does not leak secrets',async t=>{const s=await setup(t);const r=await s.send('/health',{who:null});assert.ok(!JSON.stringify(r.body).includes(S));});
test('protected search requires signed session',async t=>{const s=await setup(t);assert.equal((await s.send('/search',{who:null})).status,401);});
test('invalid Bearer signature denied',async t=>{const s=await setup(t);const r=await s.send('/search',{who:null,headers:{authorization:'Bearer malformed.token'}});assert.equal(r.status,401);});
test('tampered signed actor does not authenticate',async t=>{const s=await setup(t);const v=s.tokens.alice.replace('a','b');assert.equal((await s.send('/search',{who:null,headers:{authorization:'Bearer '+v}})).status,401);});
test('expired signed session denied',async t=>{let now=1_000_000;const s=await setup(t,{clock:()=>now});now+=301_000;assert.equal((await s.send('/search')).status,401);});
test('logout revokes signed session',async t=>{const s=await setup(t);assert.equal((await s.send('/logout',{method:'POST'})).status,200);assert.equal((await s.send('/search')).status,401);});
test('logout needs correct Origin',async t=>{const s=await setup(t);assert.equal((await s.send('/logout',{method:'POST',originHeader:false})).status,403);assert.equal((await s.send('/search')).status,200);});
test('write with foreign Origin rejected',async t=>{const s=await setup(t);assert.equal((await s.send('/search/documents',{...upsert('doc'),headers:{origin:'https://other.invalid'}})).status,403);});
test('write missing Origin rejected',async t=>{const s=await setup(t);assert.equal((await s.send('/search/documents',{...upsert('doc'),originHeader:false})).status,403);});
test('viewer is forbidden from document writes',async t=>{const s=await setup(t);assert.equal((await s.send('/search/documents',upsert('doc','title',1,'bob'))).status,403);});
test('viewer can read tenant-scoped search',async t=>{const s=await setup(t);await s.send('/search/documents',upsert('d'));assert.equal((await s.send('/search',{who:'bob'})).body.total,1);});
test('unrecognized method/path rejected',async t=>{const s=await setup(t);assert.equal((await s.send('/not-a-route')).status,404);});
test('JSON media type required for structured writes',async t=>{const s=await setup(t);const r=await s.send('/search/documents',{method:'POST',body:'{"id":"d"}',headers:{'content-type':'text/plain'}});assert.equal(r.status,415);});
test('malformed JSON denied without internal error details',async t=>{const s=await setup(t);const r=await s.send('/search/documents',{method:'POST',body:'{no',headers:{'content-type':'application/json'}});assert.deepEqual(r.body,{error:'invalid-json'});});
test('bounded JSON rejects huge bodies',async t=>{const s=await setup(t);const r=await s.send('/search/documents',{method:'POST',body:{id:'d',title:'x',body:'x'.repeat(20000),version:1}});assert.equal(r.status,413);});
test('JSON arrays rejected',async t=>{const s=await setup(t);assert.equal((await s.send('/search/documents',{method:'POST',body:[1,2,3]})).status,400);});
test('document insert is tenant-scoped',async t=>{const s=await setup(t);assert.equal((await s.send('/search/documents',upsert('id-a'))).status,201);assert.equal((await s.send('/search',{who:'carol'})).body.total,0);});
test('client-supplied tenant is not trusted',async t=>{const s=await setup(t);const x=upsert('id-a');x.body.tenantId='south';assert.equal((await s.send('/search/documents',x)).status,201);assert.equal((await s.send('/search',{who:'carol'})).body.total,0);});
test('same document ID is isolated across tenants',async t=>{const s=await setup(t);await s.send('/search/documents',upsert('same','north entry'));await s.send('/search/documents',upsert('same','south entry',1,'carol'));assert.equal((await s.send('/search',{who:'alice'})).body.items[0].title,'north entry');assert.equal((await s.send('/search',{who:'carol'})).body.items[0].title,'south entry');});
test('search ranks title matches over body matches',async t=>{const s=await setup(t);await s.send('/search/documents',upsert('a','misc',1,'alice','visible','report'));await s.send('/search/documents',upsert('b','report',1,'alice','visible','misc'));assert.deepEqual((await s.send('/search?q=report')).body.items.map(v=>v.id),['b','a']);});
test('hidden documents never appear',async t=>{const s=await setup(t);await s.send('/search/documents',upsert('private','secret',1,'alice','hidden'));assert.equal((await s.send('/search?q=secret')).body.total,0);});
test('stale document update cannot overwrite',async t=>{const s=await setup(t);await s.send('/search/documents',upsert('a','latest',2));const r=await s.send('/search/documents',upsert('a','old',1));assert.equal(r.body.updated,false);assert.equal((await s.send('/search')).body.items[0].title,'latest');});
test('invalid search limit fails',async t=>{const s=await setup(t);assert.equal((await s.send('/search?limit=999')).status,422);});
test('search pagination returns stable second page',async t=>{const s=await setup(t);for(let i=0;i<3;i++)await s.send('/search/documents',upsert('d'+i,'report'));const p=await s.send('/search?q=report&limit=2');assert.equal(p.body.items.length,2);const q=await s.send('/search?q=report&limit=2&cursor='+encodeURIComponent(p.body.next));assert.equal(q.body.items.length,1);});
test('foreign tenant cannot replay a search cursor',async t=>{const s=await setup(t);for(let i=0;i<3;i++)await s.send('/search/documents',upsert('d'+i,'report'));const c=(await s.send('/search?limit=1')).body.next;assert.equal((await s.send('/search?limit=1&cursor='+encodeURIComponent(c),{who:'carol'})).status,422);});
test('cursor invalidates on index mutation',async t=>{const s=await setup(t);for(let i=0;i<3;i++)await s.send('/search/documents',upsert('d'+i,'report'));const c=(await s.send('/search?limit=1')).body.next;await s.send('/search/documents',upsert('d4','report'));assert.equal((await s.send('/search?limit=1&cursor='+encodeURIComponent(c))).status,422);});
test('viewer cannot request upload intent',async t=>{const s=await setup(t);assert.equal((await s.send('/upload-intents',{who:'bob',method:'POST',body:{filename:'a.png',contentType:'image/png'}})).status,403);});
test('upload intent must be JSON',async t=>{const s=await setup(t);assert.equal((await s.send('/upload-intents',{method:'POST',body:'hi',headers:{'content-type':'text/plain'}})).status,415);});
test('unknown upload MIME denied',async t=>{const s=await setup(t);assert.equal((await s.send('/upload-intents',{method:'POST',body:{filename:'a.exe',contentType:'application/x-executable'}})).status,422);});
test('valid PNG upload stays quarantined',async t=>{const s=await setup(t);const tok=await intent(s);const r=await upload(s,tok);assert.equal(r.status,201);assert.equal(r.body.status,'quarantined');assert.equal((await s.send('/assets/'+r.body.assetId)).status,404);});
test('valid PDF upload supported',async t=>{const s=await setup(t);const tok=await intent(s,'letter.pdf','application/pdf');assert.equal((await upload(s,tok,PDF)).status,201);});
test('signed token cannot be used by foreign tenant',async t=>{const s=await setup(t);const tok=await intent(s);assert.equal((await upload(s,tok,PNG,'carol')).status,403);});
test('signed token cannot be used by different same-tenant user',async t=>{const s=await setup(t);const tok=await intent(s);assert.equal((await upload(s,tok,PNG,'mary')).status,403);});
test('forged upload token rejected',async t=>{const s=await setup(t);const tok=await intent(s);assert.equal((await upload(s,tok+'0')).status,403);});
test('upload token cannot be replayed after success',async t=>{const s=await setup(t);const tok=await intent(s);assert.equal((await upload(s,tok)).status,201);assert.equal((await upload(s,tok)).status,409);});
test('invalid bytes consume one-time upload intent',async t=>{const s=await setup(t);const tok=await intent(s);assert.equal((await upload(s,tok,PDF)).status,422);assert.equal((await upload(s,tok,PNG)).status,409);});
test('oversized byte stream denied',async t=>{const s=await setup(t);const tok=await intent(s);assert.equal((await upload(s,tok,Buffer.alloc(600000))).status,413);});
test('upload rejects wrong media type',async t=>{const s=await setup(t);const tok=await intent(s);assert.equal((await s.send('/uploads',{method:'PUT',body:PNG,headers:{'content-type':'image/png','x-lab-upload-token':tok}})).status,415);});
test('upload token expires at bound',async t=>{let now=1_000_000;const s=await setup(t,{clock:()=>now});const tok=await intent(s);now+=60_000;assert.equal((await upload(s,tok)).status,403);});
test('clean scan enables owner metadata read',async t=>{const s=await setup(t);const r=await upload(s,await intent(s));s.gw.markScan(r.body.assetId,'clean');const view=await s.send('/assets/'+r.body.assetId);assert.equal(view.status,200);assert.equal(view.body.contentType,'image/png');assert.ok(!JSON.stringify(view.body).includes('payload'));});
test('clean scan never authorizes same-tenant foreign user',async t=>{const s=await setup(t);const r=await upload(s,await intent(s));s.gw.markScan(r.body.assetId,'clean');assert.equal((await s.send('/assets/'+r.body.assetId,{who:'mary'})).status,404);});
test('clean scan never authorizes foreign tenant',async t=>{const s=await setup(t);const r=await upload(s,await intent(s));s.gw.markScan(r.body.assetId,'clean');assert.equal((await s.send('/assets/'+r.body.assetId,{who:'carol'})).status,404);});
test('failed scanner stays private',async t=>{const s=await setup(t);const r=await upload(s,await intent(s));s.gw.markScan(r.body.assetId,'failed');assert.equal((await s.send('/assets/'+r.body.assetId)).status,404);});
test('malicious verdict stays private',async t=>{const s=await setup(t);const r=await upload(s,await intent(s));s.gw.markScan(r.body.assetId,'malicious');assert.equal((await s.send('/assets/'+r.body.assetId)).status,404);});
test('no HTTP scan override route exposed',async t=>{const s=await setup(t);assert.equal((await s.send('/scan',{method:'POST',body:{id:'x',status:'clean'}})).status,404);});
test('viewer forbidden from sending email jobs',async t=>{const s=await setup(t);assert.equal((await s.send('/mail',email('k','transactional','receipt',{amount:5},'bob'))).status,403);});
test('transactional email enqueues without marketing opt-in',async t=>{const s=await setup(t);assert.equal((await s.send('/mail',email('k'))).body.status,'pending');});
test('marketing email suppressed absent consent',async t=>{const s=await setup(t);assert.equal((await s.send('/mail',email('k','marketing','offer'))).body.status,'suppressed');});
test('marketing email accepted after instructor opt-in',async t=>{const s=await setup(t);s.gw.setConsent('north','alice',true);assert.equal((await s.send('/mail',email('k','marketing','offer'))).body.status,'pending');});
test('marketing consent withdrawal before claim suppresses',async t=>{const s=await setup(t);s.gw.setConsent('north','alice',true);const x=await s.send('/mail',email('k','marketing','offer'));s.gw.setConsent('north','alice',false);assert.equal(s.gw.claimMail(x.body.id),null);assert.equal((await s.send('/mail?id='+encodeURIComponent(x.body.id))).body.status,'suppressed');});
test('email idempotency resolves to same job',async t=>{const s=await setup(t);const a=await s.send('/mail',email('same'));const b=await s.send('/mail',email('same'));assert.equal(a.body.id,b.body.id);});
test('email conflicting reused key rejected',async t=>{const s=await setup(t);await s.send('/mail',email('same'));const r=await s.send('/mail',email('same','transactional','receipt',{amount:6}));assert.equal(r.status,409);});
test('mail job read scoped to owner even same tenant',async t=>{const s=await setup(t);const a=await s.send('/mail',email('k'));assert.equal((await s.send('/mail?id='+encodeURIComponent(a.body.id),{who:'mary'})).status,404);assert.equal((await s.send('/mail?id='+encodeURIComponent(a.body.id),{who:'carol'})).status,404);});
test('mail claims bounded retry and terminal state',async t=>{let now=1_000_000;const s=await setup(t,{clock:()=>now});const a=await s.send('/mail',email('k'));assert.ok(s.gw.claimMail(a.body.id));assert.equal(s.gw.settleMail(a.body.id,{success:false,retryable:true}).nextAt,now+1000);assert.equal(s.gw.claimMail(a.body.id),null);now+=1000;assert.ok(s.gw.claimMail(a.body.id));s.gw.settleMail(a.body.id,{success:false,retryable:true});now+=2000;assert.ok(s.gw.claimMail(a.body.id));assert.equal(s.gw.settleMail(a.body.id,{success:false,retryable:true}).status,'dead-letter');});
test('webhook valid raw bytes accepted',async t=>{const s=await setup(t);assert.equal((await s.send('/webhooks',sign())).status,202);});
test('webhook same delivery id and body deduplicated',async t=>{const s=await setup(t);await s.send('/webhooks',sign());const r=await s.send('/webhooks',sign());assert.equal(r.status,200);assert.equal(r.body.status,'duplicate');});
test('webhook changed signed body with same event id denied',async t=>{const s=await setup(t);await s.send('/webhooks',sign());const r=await s.send('/webhooks',sign({body:Buffer.from('{"ok":false}')}));assert.equal(r.status,409);});
test('webhook invalid signature denied',async t=>{const s=await setup(t);const x=sign();x.headers['x-lab-signature']='0'.repeat(64);assert.equal((await s.send('/webhooks',x)).status,401);});
test('webhook altered body after signing denied',async t=>{const s=await setup(t);const x=sign();x.body=Buffer.from('x');assert.equal((await s.send('/webhooks',x)).status,401);});
test('webhook stale timestamp denied',async t=>{const s=await setup(t);assert.equal((await s.send('/webhooks',sign({ts:1}))).status,401);});
test('webhook future timestamp beyond window denied',async t=>{const s=await setup(t);assert.equal((await s.send('/webhooks',sign({ts:2_000_000}))).status,401);});
test('webhook unregistered provider denied',async t=>{const s=await setup(t);assert.equal((await s.send('/webhooks',sign({provider:'unknown'}))).status,401);});
test('webhook wrong content-type denied',async t=>{const s=await setup(t);const x=sign();x.headers['content-type']='text/plain';assert.equal((await s.send('/webhooks',x)).status,415);});
test('webhook event id must be constrained',async t=>{const s=await setup(t);const x=sign({eventId:'bad id'});assert.equal((await s.send('/webhooks',x)).status,401);});
test('webhook cannot spoof tenant via caller header',async t=>{const s=await setup(t);const x=sign();x.headers['x-tenant-id']='south';assert.equal((await s.send('/webhooks',x)).status,202);});
test('webhook provider bindings isolate same external event IDs',async t=>{const s=await setup(t);assert.equal((await s.send('/webhooks',sign())).status,202);assert.equal((await s.send('/webhooks',sign({provider:'another'}))).status,202);});
test('webhook oversized payload denied',async t=>{const s=await setup(t);const body=Buffer.alloc(66_000,97);assert.equal((await s.send('/webhooks',sign({body}))).status,413);});
test('webhook can be claimed and acknowledged once',async t=>{const s=await setup(t);await s.send('/webhooks',sign());const id=JSON.stringify(['provider','north','event-1']);assert.equal(s.gw.claimWebhook(id).status,'processing');assert.equal(s.gw.settleWebhook(id,true).status,'processed');assert.equal(s.gw.claimWebhook(id),null);});
test('signed search cursor cannot be changed without a MAC',async t=>{const s=await setup(t);for(let i=0;i<3;i++)await s.send('/search/documents',upsert('d'+i));const c=(await s.send('/search?limit=1')).body.next;assert.equal((await s.send('/search?limit=1&cursor='+encodeURIComponent(c+'x'))).status,422);});
test('signed search cursor is user-scoped within the same tenant',async t=>{const s=await setup(t);for(let i=0;i<3;i++)await s.send('/search/documents',upsert('d'+i));const c=(await s.send('/search?limit=1')).body.next;assert.equal((await s.send('/search?limit=1&cursor='+encodeURIComponent(c),{who:'bob'})).status,422);});
test('upload intent rejects traversal before signing',async t=>{const s=await setup(t);assert.equal((await s.send('/upload-intents',{method:'POST',body:{filename:'../photo.png',contentType:'image/png'}})).status,422);});
test('upload intent rejects extension and declared MIME mismatch before signing',async t=>{const s=await setup(t);assert.equal((await s.send('/upload-intents',{method:'POST',body:{filename:'picture.pdf',contentType:'image/png'}})).status,422);});
test('upload intent capacity is bounded on the local instructor fixture',async t=>{const s=await setup(t);for(let i=0;i<128;i++){const x=await s.send('/upload-intents',{method:'POST',body:{filename:'pic'+i+'.png',contentType:'image/png'}});assert.equal(x.status,201);}const refused=await s.send('/upload-intents',{method:'POST',body:{filename:'next.png',contentType:'image/png'}});assert.equal(refused.status,429);});
