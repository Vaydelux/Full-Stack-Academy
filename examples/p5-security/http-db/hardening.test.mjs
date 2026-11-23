import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {readFileSync} from 'node:fs';
import {createHttpDbLab} from './server.mjs';
import {createRepository} from './connection.mjs';
const env={P5_LAB_CONFIRM:'DISPOSABLE_ONLY',P5_HTTP_DB_CONFIRM:'ISOLATED_CLUSTER',P5_LAB_DATABASE_URL:'postgresql://lab:dummy@127.0.0.1:5432/p5_lab_security',PATH:'/usr/bin:/bin'};
function mockDb(){
 const membership={alice:{tenant:'alpha',role:'owner',active:true},bob:{tenant:'beta',role:'owner',active:true},viewer:{tenant:'alpha',role:'viewer',active:true},suspended:{tenant:'alpha',role:'owner',active:false}};
 const docs=new Map([
  ['alpha-1',{id:'alpha-1',tenant:'alpha',title:'Alpha',locked:false,deleted:false}],
  ['beta-1',{id:'beta-1',tenant:'beta',title:'Beta',locked:false,deleted:false}],
  ['alpha-locked',{id:'alpha-locked',tenant:'alpha',title:'Locked',locked:true,deleted:false}],
  ['alpha-deleted',{id:'alpha-deleted',tenant:'alpha',title:'Deleted',locked:false,deleted:true}],
 ]);
 return {
  membership,docs,
  async action(action,{actor,docId,title}){
   if(!['read','update','delete','upload'].includes(action))throw Error('Unknown user action');
   const principal=membership[actor],doc=docs.get(docId);
   if(!principal?.active||!doc||doc.deleted||principal.tenant!==doc.tenant)return null;
   if(action==='read')return {id:doc.id,title:doc.title};
   if(principal.role==='viewer')return null;
   if(action==='upload'&&doc.locked)return null;
   if(action==='update'){
    if(doc.locked)return null;
    doc.title=title;return {id:doc.id,title:doc.title};
   }
   if(action==='delete'){docs.delete(docId);return {id:docId};}
   return {tenantId:doc.tenant,documentId:doc.id};
  },
  async revokeForQualification(userId){membership[userId].active=false;return {revoked:1};}
 };
}
async function withApi(callback){
 const repo=mockDb(),app=createHttpDbLab(repo);
 app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
 const url='http://127.0.0.1:'+app.server.address().port;
 const call=async(actor,path,{method='GET',data,headers={}}={})=>{
  const token=actor?app.issue(actor):'';
  const response=await fetch(url+path,{method,headers:{cookie:'academy_session='+token,...(method!=='GET'?{origin:app.origin}:{}),...(data?{'content-type':'application/json'}:{}),...headers},body:data?JSON.stringify(data):undefined});
  return {status:response.status,body:await response.json(),headers:response.headers};
 };
 try{await callback({repo,app,url,call});}
 finally{app.server.closeAllConnections();await new Promise(resolve=>app.server.close(resolve));}
}
test('suspended identity has no document read or upload intent',()=>withApi(async({call})=>{
 assert.equal((await call('suspended','/documents/alpha-1')).status,404);
 assert.equal((await call('suspended','/upload-intents',{method:'POST',data:{documentId:'alpha-1',contentType:'application/pdf'}})).status,404);
}));
test('deleted document cannot be fetched or uploaded',()=>withApi(async({call})=>{
 assert.equal((await call('alice','/documents/alpha-deleted')).status,404);
 assert.equal((await call('alice','/upload-intents',{method:'POST',data:{documentId:'alpha-deleted',contentType:'application/pdf'}})).status,404);
}));
test('locked document cannot be modified or uploaded but can be read',()=>withApi(async({call})=>{
 assert.equal((await call('alice','/documents/alpha-locked')).status,200);
 assert.equal((await call('alice','/documents/alpha-locked',{method:'PATCH',data:{title:'Not allowed'}})).status,404);
 assert.equal((await call('alice','/upload-intents',{method:'POST',data:{documentId:'alpha-locked',contentType:'application/pdf'}})).status,404);
}));
test('logout invalidates a valid session for subsequent replay',()=>withApi(async({app,url})=>{
 const tok=app.issue('alice');const cookie='academy_session='+tok;
 const get=()=>fetch(url+'/documents/alpha-1',{headers:{cookie}});
 assert.equal((await get()).status,200);
 const logout=await fetch(url+'/sessions/logout',{method:'POST',headers:{cookie,origin:app.origin}});
 assert.deepEqual(await logout.json(),{loggedOut:true});
 assert.equal((await get()).status,401);
}));
test('cross-origin logout is refused and session remains valid',()=>withApi(async({app,url})=>{
 const cookie='academy_session='+app.issue('alice');
 const logout=await fetch(url+'/sessions/logout',{method:'POST',headers:{cookie,origin:'https://evil.example'}});
 assert.equal(logout.status,403);
 assert.equal((await fetch(url+'/documents/alpha-1',{headers:{cookie}})).status,200);
}));
test('replayed logout after session invalidation does not succeed',()=>withApi(async({app,url})=>{
 const cookie='academy_session='+app.issue('bob');
 const call=()=>fetch(url+'/sessions/logout',{method:'POST',headers:{cookie,origin:app.origin}});
 assert.equal((await call()).status,200);
 assert.equal((await call()).status,401);
}));
test('header identity spoofing never authorizes another tenant',()=>withApi(async({app,url})=>{
 const cookie='academy_session='+app.issue('alice');
 const result=await fetch(url+'/documents/beta-1',{headers:{cookie,'x-user-id':'bob','x-tenant-id':'beta'}});
 assert.equal(result.status,404);
 assert.deepEqual(await result.json(),{error:'not_found'});
}));
test('invalid JSON does not expose SQL or stack traces',()=>withApi(async({app,url})=>{
 const cookie='academy_session='+app.issue('alice');
 const result=await fetch(url+'/documents/alpha-1',{method:'PATCH',headers:{cookie,origin:app.origin},body:'{' });
 assert.equal(result.status,400);assert.deepEqual(await result.json(),{error:'invalid_json'});
}));
test('oversized write request returns 413 without SQL detail',()=>withApi(async({app,url})=>{
 const cookie='academy_session='+app.issue('alice');
 const result=await fetch(url+'/documents/alpha-1',{method:'PATCH',headers:{cookie,origin:app.origin},body:JSON.stringify({title:'X'.repeat(18000)})});
 assert.equal(result.status,413);assert.deepEqual(await result.json(),{error:'body_too_large'});
}));
test('unrecognized administrative repository action is rejected',async()=>{
 const repo=createRepository(env,{executor:async()=>({stdout:'null'})});
 await assert.rejects(repo.action('revoke',{actor:'alice',docId:'bob'}),/Invalid action/);
 await assert.rejects(repo.revokeForQualification('../bob'),/Invalid user ID/);
});
test('administrative revocation runs a separate SQL file',async()=>{
 let args;const repo=createRepository(env,{executor:async(_binary,a)=>{args=a;return {stdout:'{"revoked":1}'};}});
 assert.deepEqual(await repo.revokeForQualification('alice'),{revoked:1});
 assert.ok(args.at(-1).endsWith('revoke.sql'));
 assert.ok(args.includes('user_id=alice'));
 assert.ok(!args.includes('P5_REVOKE=1'));
});
test('SQL upload checks active user and non-deleted document',()=>{
 const query=readFileSync(new URL('./query.sql',import.meta.url),'utf8');
 assert.match(query,/NOT d\.deleted/);assert.match(query,/u\.active/);assert.match(query,/JOIN :"schema"\.users u/);
 assert.doesNotMatch(query,/P5_REVOKE/);
});
test('fixture includes suspended and deleted adversarial cases',()=>{
 const sql=readFileSync(new URL('./setup.sql',import.meta.url),'utf8');
 assert.match(sql,/\('suspended',false\)/);assert.match(sql,/\('alpha-deleted','alpha','Deleted',true\)/);
});
test('synthetic admin path is not exposed through the HTTP router',()=>withApi(async({app,url})=>{
 const cookie='academy_session='+app.issue('alice');
 const res=await fetch(url+'/admin/revoke',{method:'POST',headers:{cookie,origin:app.origin,'content-type':'application/json'},body:JSON.stringify({userId:'bob'})});
 assert.equal(res.status,404);
}));
test('preflight rejects RLS bypass and incorrect database identity',async()=>{
 for(const content of ['{"database":"production","serverVersion":170000,"rowSecurity":"on","super":false,"bypass":false}','{"database":"p5_lab_security","serverVersion":170000,"rowSecurity":"on","super":false,"bypass":true}']){
  const repo=createRepository(env,{executor:async()=>({stdout:content})});
  await assert.rejects(repo.preflight(),/unsafe/);
 }
});
test('preflight rejects PostgreSQL versions older than 17 or disabled RLS',async()=>{
 for(const content of [
  '{"database":"p5_lab_security","serverVersion":160001,"rowSecurity":"on","super":false,"bypass":false}',
  '{"database":"p5_lab_security","serverVersion":170000,"rowSecurity":"off","super":false,"bypass":false}',
  '{"database":"p5_lab_security","super":false,"bypass":false}'
 ]){
  const repo=createRepository(env,{executor:async()=>({stdout:content})});
  await assert.rejects(repo.preflight(),/unsafe/);
 }
});
