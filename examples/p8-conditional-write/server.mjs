import {createServer} from 'node:http';
const MAX_BYTES=1024;
class BodyError extends Error {
 constructor(status,code){super(code);this.status=status;this.code=code;}
}
function readBody(req,timeoutMs){
 return new Promise((resolve,reject)=>{
  let size=0;const chunks=[];
  const finish=(error,value)=>{
   clearTimeout(timer);
   req.off('data',onData);req.off('end',onEnd);req.off('error',onError);req.off('aborted',onError);
   if(error){req.pause();reject(error);}else resolve(value);
  };
  const onData=chunk=>{
   size+=chunk.length;
   if(size>MAX_BYTES){finish(new BodyError(413,'too-large'));return;}
   chunks.push(chunk);
  };
  const onEnd=()=>finish(null,Buffer.concat(chunks));
  const onError=()=>finish(new BodyError(400,'request'));
  const timer=setTimeout(()=>finish(new BodyError(408,'body-timeout')),timeoutMs);
  req.on('data',onData);req.once('end',onEnd);req.once('error',onError);req.once('aborted',onError);
 });
}
// Local educational fixture only: no authentication or durable storage.
export function createTaskServer({bodyTimeoutMs=5000}={}){
 if(!Number.isInteger(bodyTimeoutMs)||bodyTimeoutMs<1||bodyTimeoutMs>60000)throw new RangeError('Invalid body timeout');
 let task={id:1,title:'Review lesson',done:false,revision:1};
 const tag=()=>`"${task.revision}"`;
 const reply=(res,status,body,close=false)=>{
  res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff',...(status===200||status===412?{etag:tag()}:{}),...(close?{connection:'close'}:{})});
  res.end(JSON.stringify(body));
 };
 const server=createServer(async(req,res)=>{
  // Always keep the teaching fixture on a literal loopback address.
  const address=server.address();
  const expected=address?.address==='127.0.0.1'?`127.0.0.1:${address.port}`:address?.address==='::1'?`[::1]:${address.port}`:null;
  if(!expected||req.headers.host!==expected){reply(res,421,{error:'host'},true);return;}
  if((req.headers.origin&&req.headers.origin!==`http://${expected}`)||req.headers['sec-fetch-site']==='cross-site'){reply(res,403,{error:'origin'},true);return;}
  if(req.url!=='/task'){reply(res,404,{error:'not-found'},true);return;}
  if(req.method==='GET'){reply(res,200,task);return;}
  if(req.method!=='PATCH'){res.setHeader('allow','GET, PATCH');reply(res,405,{error:'method'},true);return;}
  if(!/^application\/json(?:\s*;\s*charset\s*=\s*(?:utf-8|"utf-8"))?\s*$/i.test(req.headers['content-type']??'')||!['','identity'].includes((req.headers['content-encoding']??'').toLowerCase())){reply(res,415,{error:'content-type-or-encoding'},true);return;}
  const length=req.headers['content-length'];
  if(length!==undefined&&(!/^\d+$/.test(length)||Number(length)>MAX_BYTES)){reply(res,413,{error:'too-large'},true);return;}
  try{
   const bytes=await readBody(req,bodyTimeoutMs);
   let body;try{body=JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes));}catch{reply(res,400,{error:'json'});return;}
   if(!body||Array.isArray(body)||typeof body.done!=='boolean'||!Object.hasOwn(body,'done')||Object.keys(body).length!==1){reply(res,422,{error:'invalid-task'});return;}
   // Check after asynchronous body reading; compare and mutate synchronously.
   if(req.headers['if-match']===undefined){reply(res,428,{error:'precondition-required'});return;}
   if(req.headers['if-match']!==tag()){reply(res,412,{error:'revision-conflict'});return;}
   task={...task,done:body.done,revision:task.revision+1};reply(res,200,task);
  }catch(error){if(!res.headersSent&&!res.destroyed)reply(res,error instanceof BodyError?error.status:500,{error:error instanceof BodyError?error.code:'internal'},true);}
 });
 return server;
}
