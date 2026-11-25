import {createServer} from 'node:http';
import {Fault} from './workspace.mjs';
import assert from 'node:assert/strict';
const id=/^[A-Za-z0-9_-]{1,64}$/;
const reply=(res,status,body)=>{res.writeHead(status,{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(body));};
async function readBody(req){if(req.headers['content-type']!=='application/json')throw new Fault(415,'unsupported-content-type');let bytes=0;const parts=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>4096)throw new Fault(413,'body-too-large');parts.push(chunk);}try{return JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw new Fault(400,'invalid-json');}}
export function makeWorkspaceServer(workspace,sessions,{now=Date.now}={}){
 // Synthetic fixture tokens; no OIDC or real MFA verification claim.
 const server=createServer({requestTimeout:5000,headersTimeout:4000,maxHeaderSize:8192},async(req,res)=>{try{
  const url=new URL(req.url,'http://127.0.0.1');if(req.method==='GET'&&url.pathname==='/health')return reply(res,200,{ok:true});
  const token=/^Bearer ([A-Za-z0-9_-]{16,128})$/.exec(req.headers.authorization??'')?.[1],session=sessions.get(token);if(!session||!Number.isSafeInteger(session.expires)||session.expires<=now())throw new Fault(401,'unauthenticated');
  const [,prefix,tenant,action,document,...rest]=url.pathname.split('/');if(prefix!=='workspaces'||!id.test(tenant??'')||rest.length)throw new Fault(404,'not-found');
  if(action==='sync'&&!document&&req.method==='POST')return reply(res,200,workspace.apply(session,tenant,await readBody(req)));
  if(action==='documents'&&document&&req.method==='GET')return reply(res,200,workspace.get(session,tenant,document));
  if(action==='search'&&!document&&req.method==='GET')return reply(res,200,workspace.search(session,tenant,url.searchParams.get('q')));
  if(action==='revoke'&&document&&req.method==='POST'){const data=await readBody(req);workspace.revoke(session,tenant,document,data?.reason);return reply(res,200,{revoked:true});}
  throw new Fault(404,'not-found');
 }catch(e){if(!res.headersSent&&!res.destroyed)reply(res,e instanceof Fault?e.status:500,{error:e instanceof Fault?e.message:'internal-error'});}});
 return {server,async listen(){await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});return 'http://127.0.0.1:'+server.address().port;},async close(){await new Promise((resolve,reject)=>{server.close(e=>e?reject(e):resolve());server.closeAllConnections();});}};
}
export function localClient(origin,token,tenant){const url=new URL(origin);assert.ok(url.protocol==='http:'&&url.hostname==='127.0.0.1'&&url.port&&url.pathname==='/'&&!url.search&&!url.hash&&!url.username&&!url.password);assert.match(tenant,id);
 return async(path,method='GET',body)=>{assert.match(path,/^\/(sync|documents\/[A-Za-z0-9_-]+|search\?q=[^#]*|revoke\/[A-Za-z0-9_-]+)$/);const response=await fetch(url.origin+'/workspaces/'+tenant+path,{method,headers:{Authorization:'Bearer '+token,...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),redirect:'error',signal:AbortSignal.timeout(5000)});return {status:response.status,body:await response.json()};};
}
