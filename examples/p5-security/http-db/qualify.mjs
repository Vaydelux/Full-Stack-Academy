import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createRepository} from './connection.mjs';
import {createHttpDbLab} from './server.mjs';

// Genuine psql + ephemeral HTTP integration; never runs during install/build.
let repo;
try{repo=createRepository(process.env);}catch(err){console.error('BLOCKED: '+err.message);process.exit(2);}
let setupAttempted=false,server;
let checks=0;
const equal=(actual,expected)=>{assert.equal(actual,expected);checks++;};
const match=(actual,regex)=>{assert.match(actual,regex);checks++;};
try{
 await repo.preflight();
 setupAttempted=true;await repo.setup();
 const app=createHttpDbLab(repo);server=app.server;
 server.listen(0,'127.0.0.1');await once(server,'listening');
 const base='http://127.0.0.1:'+server.address().port;
 async function request(actor,path,{method='GET',body,headers={}}={}){
  const tok=actor?app.issue(actor):'';
  const response=await fetch(base+path,{method,headers:{cookie:'academy_session='+tok,...(method!=='GET'?{origin:app.origin}:{}),...(body?{'content-type':'application/json'}:{}),...headers},body:body?JSON.stringify(body):undefined});
  return {status:response.status,data:await response.json()};
 }
 equal((await request(null,'/documents/alpha-1')).status,401);
 equal((await request('alice','/documents/alpha-1')).data.title,'Alpha');
 equal((await request('bob','/documents/beta-1')).data.title,'Beta');
 equal((await request('viewer','/documents/alpha-1')).status,200);
 const concurrent=await Promise.all([
  request('alice','/documents/alpha-1'),request('alice','/documents/beta-1'),
  request('bob','/documents/beta-1'),request('viewer','/documents/alpha-1')
 ]);
 equal(concurrent[0].status,200);equal(concurrent[1].status,404);
 equal(concurrent[2].status,200);equal(concurrent[3].status,200);
 equal((await request('alice','/documents/beta-1')).status,404);
 equal((await request('alice','/documents/beta-1',{method:'PATCH',body:{title:'Attack'}})).status,404);
 equal((await request('alice','/documents/beta-1',{method:'DELETE'})).status,404);
 equal((await request('bob','/documents/beta-1')).data.title,'Beta');
 equal((await request('viewer','/documents/alpha-1',{method:'PATCH',body:{title:'Attack'}})).status,404);
 equal((await request('viewer','/documents/alpha-1',{method:'DELETE'})).status,404);
 equal((await request('alice','/documents/alpha-locked',{method:'PATCH',body:{title:'Attack'}})).status,404);
 equal((await request('suspended','/documents/alpha-1')).status,404);
 equal((await request('suspended','/upload-intents',{method:'POST',body:{documentId:'alpha-1',contentType:'application/pdf'}})).status,404);
 equal((await request('alice','/documents/alpha-deleted')).status,404);
 equal((await request('alice','/upload-intents',{method:'POST',body:{documentId:'alpha-deleted',contentType:'application/pdf'}})).status,404);
 equal((await request('alice','/documents/alpha-locked')).data.title,'Locked');
 equal((await request('alice','/documents/alpha-1',{method:'PATCH',body:{title:"quoted' value"}})).status,200);
 equal((await request('alice','/documents/alpha-1')).data.title,"quoted' value");
 equal((await request('alice','/documents/alpha-1',{method:'PATCH',body:{title:'Forbidden'},headers:{origin:'https://attacker.example'}})).status,403);
 equal((await request('alice','/upload-intents',{method:'POST',body:{documentId:'beta-1',contentType:'application/pdf'}})).status,404);
 equal((await request('viewer','/upload-intents',{method:'POST',body:{documentId:'alpha-1',contentType:'application/pdf'}})).status,404);
 const intent=await request('alice','/upload-intents',{method:'POST',body:{documentId:'alpha-1',contentType:'application/pdf',tenantId:'beta',storageKey:'beta/stolen.pdf'}});
 equal(intent.status,201);match(intent.data.storageKey,/^alpha\/alpha-1\/[a-f0-9]{24}\.pdf$/);
 equal((await request('alice','/upload-intents',{method:'POST',body:{documentId:'alpha-1',contentType:'text/html'}})).status,415);
 equal((await request('alice','/upload-intents',{method:'POST',body:{documentId:'../beta-1',contentType:'application/pdf'}})).status,400);
 const expired=app.issue('alice',-10);
 equal((await fetch(base+'/documents/alpha-1',{headers:{cookie:'academy_session='+expired}})).status,401);
 const logoutToken=app.issue('bob');
 equal((await fetch(base+'/sessions/logout',{method:'POST',headers:{cookie:'academy_session='+logoutToken,origin:app.origin}})).status,200);
 equal((await fetch(base+'/documents/beta-1',{headers:{cookie:'academy_session='+logoutToken}})).status,401);
 const live=app.issue('alice');
 equal((await fetch(base+'/documents/alpha-1',{headers:{cookie:'academy_session='+live}})).status,200);
 const revoked=await repo.revokeForQualification('alice');
 equal(revoked.revoked,1);
 equal((await fetch(base+'/documents/alpha-1',{headers:{cookie:'academy_session='+live}})).status,404);
 equal((await request('bob','/documents/beta-1')).data.title,'Beta');
 equal((await request('alice','/documents/alpha-1',{method:'PATCH',body:{title:'Replay'}})).status,404);
 const afterRevoke=await Promise.all([request('alice','/documents/alpha-1'),request('bob','/documents/beta-1')]);
 equal(afterRevoke[0].status,404);equal(afterRevoke[1].status,200);
 equal((await request('bob','/documents/beta-1',{method:'DELETE'})).status,200);
 equal((await request('bob','/documents/beta-1')).status,404);
 console.log('P5_REAL_HTTP_POSTGRESQL_PASSED checks='+checks);
}catch(err){console.error('FAILED: real HTTP-to-PostgreSQL qualification: '+err.message);process.exitCode=1;}
finally{
 if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
 if(setupAttempted){try{await repo.cleanup();}catch(err){console.error('WARNING: isolated schema cleanup failed; inspect the dedicated disposable cluster');process.exitCode=1;}}
}
