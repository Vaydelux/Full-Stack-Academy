import {createServer} from 'node:http';
// Local educational fixture only: no authentication or durable storage.
export function createTaskServer(){
 let task={id:1,title:'Review lesson',done:false,revision:1};
 const tag=()=>`"${task.revision}"`;
 const reply=(res,status,body)=>{res.writeHead(status,{'content-type':'application/json','cache-control':'no-store',etag:tag()});res.end(JSON.stringify(body));};
 return createServer(async(req,res)=>{
  if(req.url!=='/task'){reply(res,404,{error:'not-found'});return;}
  if(req.method==='GET'){reply(res,200,task);return;}
  if(req.method!=='PATCH'){res.setHeader('allow','GET, PATCH');reply(res,405,{error:'method'});return;}
  if(req.headers['content-type']!=='application/json'){reply(res,415,{error:'content-type'});return;}
  let bytes=0, chunks=[];
  try{
   for await(const chunk of req){bytes+=chunk.length;if(bytes>1024){chunks=[];continue;}chunks.push(chunk);}
   if(bytes>1024){reply(res,413,{error:'too-large'});return;}
   let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{reply(res,400,{error:'json'});return;}
   if(!body||Array.isArray(body)||typeof body.done!=='boolean'||Object.keys(body).length!==1){reply(res,422,{error:'invalid-task'});return;}
   // Check after asynchronous body reading; compare and mutate synchronously.
   if(req.headers['if-match']===undefined){reply(res,428,{error:'precondition-required'});return;}
   if(req.headers['if-match']!==tag()){reply(res,412,{error:'revision-conflict'});return;}
   task={...task,done:body.done,revision:task.revision+1};reply(res,200,task);
  }catch{if(!res.headersSent&&!res.destroyed)reply(res,400,{error:'request'});}
 });
}
