import {createServer} from 'node:http';
import {randomBytes} from 'node:crypto';
import {telemetry,traceContext} from './telemetry.mjs';
import {circuit,retry} from './resilience.mjs';
export function createLab({emit=()=>{},historyLimit=4,sessionMs=60000,work=async()=>({ok:true}),now=Date.now}={}){
 if(!Number.isInteger(historyLimit)||historyLimit<1||historyLimit>100||!Number.isFinite(sessionMs)||sessionMs<=0||sessionMs>600000)throw Error('Invalid lab limits');
 const metrics=telemetry({emit}),breaker=circuit({now}),sessions=new Map(),spaces=new Map(),streams=new Set();let ready=true;
 const makeSpace=tenant=>{if(!spaces.has(tenant))spaces.set(tenant,{events:[],next:1});return spaces.get(tenant);};
 // Fixed synthetic identities; no HTTP token issuer, no deployable authentication.
 const tokens=Object.fromEntries(['alpha','beta'].map(tenant=>{const token=randomBytes(32).toString('hex');sessions.set(token,{tenant,expires:now()+sessionMs});return [tenant,token];}));
 const authorize=(token,tenant)=>{const s=sessions.get(token);return s&&s.tenant===tenant&&s.expires>now();};
 const send=(res,status,value)=>{res.writeHead(status,{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(value));};
 const end=stream=>{streams.delete(stream);stream.res.destroy();};
 const frame=e=>'id: '+e.id+'\nevent: message\ndata: '+JSON.stringify(e.value)+'\n\n';
 function write(stream,text){if(!authorize(stream.token,stream.tenant)||!stream.res.write(text))end(stream);}
 function publish(tenant,value){if(!['alpha','beta'].includes(tenant)||typeof value!=='string'||value.length>256)throw Error('Invalid lab event');const space=makeSpace(tenant),event={id:space.next++,value};space.events.push(event);if(space.events.length>historyLimit)space.events.shift();for(const stream of [...streams])if(stream.tenant===tenant)write(stream,frame(event));return event.id;}
 function revoke(token){sessions.delete(token);for(const stream of [...streams])if(stream.token===token)end(stream);}
 const server=createServer(async(req,res)=>{
  const started=performance.now(),trace=traceContext(req.headers.traceparent);res.setHeader('traceparent',trace.header);
  let route='unknown';res.once('finish',()=>metrics.observe({route,status:res.statusCode,ms:performance.now()-started,trace}));
  let url;try{url=new URL(req.url,'http://127.0.0.1');}catch{return send(res,400,{error:'bad_request'});}
  if(req.method!=='GET')return send(res,405,{error:'method_not_allowed'});
  if(['/health','/ready','/events','/work','/metrics'].includes(url.pathname))route=url.pathname;
  if(route==='/health')return send(res,200,{ok:true});
  if(route==='/ready')return send(res,ready?200:503,{ready});
  if(route==='/metrics'){res.writeHead(200,{'content-type':'text/plain; version=0.0.4; charset=utf-8','cache-control':'no-store'});return res.end(metrics.metrics());}
  if(route==='/work'){
   if(!ready)return send(res,503,{error:'not_ready'});
   try{await breaker.run(()=>retry({operation:work,idempotent:true,attempts:2,budgetMs:500,retryable:e=>e?.code==='TRANSIENT'}));return send(res,200,{ok:true});}
   catch{return send(res,503,{error:'unavailable'});}
  }
  if(route!=='/events')return send(res,404,{error:'not_found'});
  const token=req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1],tenant=url.searchParams.get('tenant');
  if(!token||!sessions.has(token)||sessions.get(token).expires<=now())return send(res,401,{error:'unauthenticated'});
  if(!authorize(token,tenant))return send(res,404,{error:'not_found'});
  const raw=req.headers['last-event-id'];if(raw!==undefined&&(typeof raw!=='string'||!/^(0|[1-9][0-9]{0,14})$/.test(raw)))return send(res,400,{error:'bad_cursor'});
  const cursor=Number(raw??0),space=makeSpace(tenant);if(cursor>=space.next)return send(res,400,{error:'future_cursor'});
  if(raw!==undefined&&space.events.length&&cursor<space.events[0].id-1)return send(res,409,{error:'snapshot_required'});
  if(streams.size>=8)return send(res,429,{error:'stream_limit'});
  res.writeHead(200,{'content-type':'text/event-stream; charset=utf-8','cache-control':'no-store','x-accel-buffering':'no'});
  const stream={res,token,tenant};streams.add(stream);res.once('close',()=>streams.delete(stream));write(stream,': connected\n\n');for(const e of space.events)if(e.id>cursor&&streams.has(stream))write(stream,frame(e));
 });
 server.requestTimeout=5000;server.headersTimeout=5000;server.maxHeadersCount=32;server.maxConnections=32;
 const heartbeat=setInterval(()=>{for(const stream of [...streams])write(stream,': heartbeat\n\n');},1000);heartbeat.unref();server.once('close',()=>clearInterval(heartbeat));
 return {server,tokens,publish,revoke,ready:value=>{ready=value===true;},streamCount:()=>streams.size,shutdown:()=>{ready=false;for(const s of [...streams])end(s);server.closeAllConnections();return new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}};
}
