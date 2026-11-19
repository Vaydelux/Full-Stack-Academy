import {createServer} from 'node:http';
import {createHash} from 'node:crypto';

// Demo-only, unauthenticated, in-memory service for LOCAL 127.0.0.1 tests.
// Not production-ready: no user identities, persistence, distributed locks or tenant isolation.
const MAX_BYTES=4096;
const json=(res,status,data,headers={})=>{
 res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers});
 res.end(status===204||status===304?'':JSON.stringify(data));
};
const problem=(res,status,title)=>{
 res.writeHead(status,{'content-type':'application/problem+json','cache-control':'no-store'});
 res.end(JSON.stringify({type:'about:blank',title,status}));
};
export function buildServer(){
 const tasks=[];
 const replay=new Map();
 return createServer(async(req,res)=>{
  try{
   const url=new URL(req.url??'/', 'http://localhost');
   if(url.pathname==='/health'&&req.method==='GET'){
    return json(res,200,{ok:true});
   }
   if(url.pathname==='/api/tasks'&&req.method==='GET'){
    const status=url.searchParams.get('status')??'all';
    if(!['all','open','done'].includes(status))return problem(res,400,'Invalid status');
    const limit=Number(url.searchParams.get('limit')??'20');
    if(!Number.isInteger(limit)||limit<1||limit>50)return problem(res,400,'Invalid limit');
    const filtered=tasks.filter(row=>status==='all'||row.status===status);
    const body=JSON.stringify({items:filtered.slice(0,limit),total:filtered.length});
    const tag='"'+createHash('sha256').update(body).digest('hex')+'"';
    const matches=(req.headers['if-none-match']??'').split(',').map(s=>s.trim().replace(/^W\//,'')).includes(tag);
    if(matches){res.writeHead(304,{'etag':tag,'cache-control':'private, no-cache'});return res.end();}
    res.writeHead(200,{'content-type':'application/json; charset=utf-8','etag':tag,'cache-control':'private, no-cache'});
    return res.end(body);
   }
   if(url.pathname==='/api/tasks'&&req.method==='POST'){
    if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']??''))return problem(res,415,'JSON required');
    const key=req.headers['idempotency-key'];
    if(typeof key!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(key))return problem(res,400,'Idempotency key required');
    let bytes=0;
    const chunks=[];
    for await(const chunk of req){
     bytes+=chunk.length;
     if(bytes>MAX_BYTES)return problem(res,413,'Payload too large');
     chunks.push(chunk);
    }
    let input;
    try{input=JSON.parse(Buffer.concat(chunks).toString('utf8'));}
    catch{return problem(res,400,'Malformed JSON');}
    if(!input||Array.isArray(input)||typeof input!=='object'||Object.keys(input).some(k=>!['title','status'].includes(k))||
      typeof input.title!=='string'||input.title.trim().length<2||input.title.length>80||
      !['open','done'].includes(input.status))return problem(res,422,'Invalid task');
    const normalized={title:input.title.trim(),status:input.status};
    const fingerprint=createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
    const prior=replay.get(key);
    if(prior){
     if(prior.fingerprint!==fingerprint)return problem(res,409,'Idempotency key conflict');
     return json(res,201,prior.record);
    }
    const record={id:'task-'+(tasks.length+1),...normalized};
    tasks.push(record);replay.set(key,{fingerprint,record});
    return json(res,201,record);
   }
   if(url.pathname==='/api/tasks'){
    res.setHeader('allow','GET, POST');
    return problem(res,405,'Method not allowed');
   }
   return problem(res,404,'Not found');
  }catch{
   return problem(res,500,'Internal server error');
  }
 });
}

