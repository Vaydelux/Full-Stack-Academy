import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {readFileSync} from 'node:fs';
import {validateDatabaseTarget,createRepository} from './connection.mjs';
import {createHttpDbLab} from './server.mjs';

const baseEnv={P5_LAB_CONFIRM:'DISPOSABLE_ONLY',P5_HTTP_DB_CONFIRM:'ISOLATED_CLUSTER',P5_LAB_DATABASE_URL:'postgresql://lab:dummy@127.0.0.1:5432/p5_lab_security',PATH:'/usr/bin:/bin'};
test('database connection is fail closed without confirmations',()=>assert.throws(()=>validateDatabaseTarget({}),/confirmations/));
test('remote host is denied',()=>assert.throws(()=>validateDatabaseTarget({...baseEnv,P5_LAB_DATABASE_URL:'postgresql://lab@db.example.com/p5_lab_security'})));
test('non-disposable database is denied',()=>assert.throws(()=>validateDatabaseTarget({...baseEnv,P5_LAB_DATABASE_URL:'postgresql://lab@127.0.0.1/production'})));
test('connection query parameters are denied',()=>assert.throws(()=>validateDatabaseTarget({...baseEnv,P5_LAB_DATABASE_URL:baseEnv.P5_LAB_DATABASE_URL+'?host=elsewhere'})));
test('connection fragment is denied',()=>assert.throws(()=>validateDatabaseTarget({...baseEnv,P5_LAB_DATABASE_URL:baseEnv.P5_LAB_DATABASE_URL+'#x'})));
test('port and credentials are parsed',()=>assert.deepEqual(validateDatabaseTarget(baseEnv),{db:'p5_lab_security',user:'lab',password:'dummy',port:5432}));
test('psql is invoked without shell and secrets are absent from args',async()=>{
 const calls=[];
 const repo=createRepository(baseEnv,{executor:async(binary,args,options)=>{calls.push({binary,args,options});return {stdout:'{"database":"p5_lab_security","serverVersion":170000,"rowSecurity":"on","super":false,"bypass":false}\n'};}});
 assert.deepEqual(await repo.preflight(),{ok:true});
 assert.equal(calls[0].binary,'psql');
 assert.equal(calls[0].options.env.PGHOSTADDR,'127.0.0.1');
 assert.equal(calls[0].options.env.PGPASSWORD,'dummy');
 assert.equal(calls[0].args.some(x=>x.includes('dummy')),false);
 assert.equal(calls[0].args.some(x=>x.includes('sh -c')),false);
});
test('preflight rejects superuser bypass',async()=>{
 const repo=createRepository(baseEnv,{executor:async()=>({stdout:'{"database":"p5_lab_security","serverVersion":170000,"rowSecurity":"on","super":true,"bypass":false}'})});
 await assert.rejects(repo.preflight(),/unsafe/);
});
test('SQL parameters use fixed -v arguments, not shell interpolation',async()=>{
 let args;
 const repo=createRepository(baseEnv,{executor:async(_binary,a)=>{args=a;return {stdout:'{"id":"alpha-1","title":"ok"}'};}});
 const row=await repo.action('update',{actor:'alice',docId:'alpha-1',title:"Hacker'; DROP TABLE users; --"});
 assert.equal(row.id,'alpha-1');
 assert.ok(args.includes("title=Hacker'; DROP TABLE users; --"));
 assert.ok(args.includes('P5_UPDATE=1'));
 await assert.rejects(repo.action('read',{actor:'alice',docId:'../beta-1'}),/Invalid document/);
});
test('source SQL forces RLS and scopes via transaction-local trusted actor',()=>{
 const schema=readFileSync(new URL('./setup.sql',import.meta.url),'utf8');
 const query=readFileSync(new URL('./query.sql',import.meta.url),'utf8');
 assert.match(schema,/ENABLE ROW LEVEL SECURITY/);
 assert.match(schema,/FORCE ROW LEVEL SECURITY/);
 assert.match(schema,/current_setting\('p5.actor',true\)/);
 assert.match(query,/SET LOCAL p5.actor/);
 assert.match(query,/RETURNING id,title/);
});

function fakeRepository(){
 const members={alice:{tenant:'alpha',role:'owner',active:true},bob:{tenant:'beta',role:'owner',active:true},viewer:{tenant:'alpha',role:'viewer',active:true}};
 const docs=new Map([['alpha-1',{id:'alpha-1',tenant:'alpha',title:'Alpha'}],['beta-1',{id:'beta-1',tenant:'beta',title:'Beta'}]]);
 return {members,async revokeForQualification(id){members[id].active=false;return {revoked:1};},async action(action,{actor,docId,title}){
  if(action==='revoke')throw Error('Unknown action');
  const m=members[actor],doc=docs.get(docId);
  if(!m?.active||!doc||m.tenant!==doc.tenant)return null;
  if(action==='read')return {id:doc.id,title:doc.title};
  if(m.role==='viewer')return null;
  if(action==='update'){doc.title=title;return {id:doc.id,title:doc.title};}
  if(action==='delete'){docs.delete(docId);return {id:docId};}
  if(action==='upload')return {tenantId:doc.tenant,documentId:doc.id};
  return null;
 }};
}
async function withApi(run){
 const repo=fakeRepository(),app=createHttpDbLab(repo);app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
 const root='http://127.0.0.1:'+app.server.address().port;
 const request=async(actor,path,{method='GET',body,headers={}}={})=>{
  const token=actor?app.issue(actor):'';
  const res=await fetch(root+path,{method,headers:{cookie:'academy_session='+token,...(method!=='GET'?{origin:app.origin}:{}),...(body?{'content-type':'application/json'}:{}),...headers},body:body?JSON.stringify(body):undefined});
  return {status:res.status,data:await res.json()};
 };
 try{await run({repo,app,root,request});}finally{app.server.closeAllConnections();await new Promise(resolve=>app.server.close(resolve));}
}
test('API returns 401 for unsigned requests',()=>withApi(async({request})=>assert.equal((await request(null,'/documents/alpha-1')).status,401)));
test('API permits authorized read',()=>withApi(async({request})=>assert.equal((await request('alice','/documents/alpha-1')).data.title,'Alpha')));
test('API denies cross-tenant ID without revealing metadata',()=>withApi(async({request})=>assert.deepEqual(await request('alice','/documents/beta-1'),{status:404,data:{error:'not_found'}})));
test('API denies cross-tenant write/delete',()=>withApi(async({request})=>{assert.equal((await request('alice','/documents/beta-1',{method:'PATCH',body:{title:'X'}})).status,404);assert.equal((await request('alice','/documents/beta-1',{method:'DELETE'})).status,404);assert.equal((await request('bob','/documents/beta-1')).data.title,'Beta');}));
test('viewer cannot update',()=>withApi(async({request})=>assert.equal((await request('viewer','/documents/alpha-1',{method:'PATCH',body:{title:'X'}})).status,404)));
test('same-origin authorized mutation succeeds',()=>withApi(async({request})=>{assert.equal((await request('alice','/documents/alpha-1',{method:'PATCH',body:{title:'New'}})).status,200);assert.equal((await request('alice','/documents/alpha-1')).data.title,'New');}));
test('cross-origin mutation is refused',()=>withApi(async({request})=>assert.equal((await request('alice','/documents/alpha-1',{method:'PATCH',body:{title:'X'},headers:{origin:'https://evil.example'}})).status,403)));
test('revoked membership rejects an existing session',()=>withApi(async({repo,app,root})=>{const token=app.issue('alice');const get=()=>fetch(root+'/documents/alpha-1',{headers:{cookie:'academy_session='+token}});assert.equal((await get()).status,200);await repo.revokeForQualification('alice');assert.equal((await get()).status,404);}));
test('expired session is rejected',()=>withApi(async({app,root})=>{const token=app.issue('alice',-1);assert.equal((await fetch(root+'/documents/alpha-1',{headers:{cookie:'academy_session='+token}})).status,401);}));
test('tampered session is rejected',()=>withApi(async({app,root})=>{const token=app.issue('alice');const [p,s]=token.split('.');const altered=p+'.'+(s[0]==='a'?'b':'a')+s.slice(1);assert.equal((await fetch(root+'/documents/alpha-1',{headers:{cookie:'academy_session='+altered}})).status,401);}));
test('cross-tenant upload intent forbidden',()=>withApi(async({request})=>assert.equal((await request('alice','/upload-intents',{method:'POST',body:{documentId:'beta-1',contentType:'application/pdf'}})).status,404)));
test('server generates tenant-scoped upload path, not client choice',()=>withApi(async({request})=>{const response=await request('alice','/upload-intents',{method:'POST',body:{documentId:'alpha-1',contentType:'application/pdf',storageKey:'beta/evil.pdf'}});assert.equal(response.status,201);assert.match(response.data.storageKey,/^alpha\/alpha-1\/[0-9a-f]{24}\.pdf$/);}));
test('unsupported media type refused',()=>withApi(async({request})=>assert.equal((await request('alice','/upload-intents',{method:'POST',body:{documentId:'alpha-1',contentType:'text/html'}})).status,415)));
