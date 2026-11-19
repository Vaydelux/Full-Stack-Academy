import {createServer} from 'node:http';
import {timingSafeEqual} from 'node:crypto';
// Local educational server. NO persistence, tenant auth, rate limits or production secrets.
const MAX_BODY=2048;
const send=(res,status,body,type='application/json')=>{
 res.writeHead(status,{'content-type':type,'cache-control':'no-store'});
 res.end(JSON.stringify(body));
};
export function createDemoServer({token}){
 if(typeof token!=='string'||!token)throw new TypeError('Token required');
 const notes=[];let nextId=1;
 return createServer(async(req,res)=>{
  try{
   if(req.url==='/health'&&req.method==='GET')return send(res,200,{ok:true});
   const provided=req.headers.authorization;
   const supplied=typeof provided==='string'&&provided.startsWith('Bearer ')?provided.slice(7):'';
   const left=Buffer.from(supplied),right=Buffer.from(token);
   if(left.length!==right.length||!timingSafeEqual(left,right))
    return send(res,401,{type:'about:blank',title:'Unauthorized',status:401},'application/problem+json');
   if(req.url!=='/api/notes')return send(res,404,{type:'about:blank',title:'Not Found',status:404},'application/problem+json');
   if(req.method==='GET')return send(res,200,{items:notes});
   if(req.method!=='POST'){res.setHeader('allow','GET, POST');return send(res,405,{type:'about:blank',title:'Method Not Allowed',status:405},'application/problem+json');}
   if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']??''))return send(res,415,{type:'about:blank',title:'Unsupported Media Type',status:415},'application/problem+json');
   const chunks=[];let size=0;
   for await(const chunk of req){size+=chunk.length;if(size>MAX_BODY)return send(res,413,{type:'about:blank',title:'Payload Too Large',status:413},'application/problem+json');chunks.push(chunk);}
   let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return send(res,400,{type:'about:blank',title:'Malformed JSON',status:400},'application/problem+json');}
   if(!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).some(k=>k!=='title')||typeof body.title!=='string'||body.title.trim().length<2||body.title.length>80)
    return send(res,422,{type:'about:blank',title:'Invalid Note',status:422},'application/problem+json');
   const record={id:'note-'+nextId++,title:body.title.trim()};notes.push(record);return send(res,201,record);
  }catch{return send(res,500,{type:'about:blank',title:'Internal Server Error',status:500},'application/problem+json');}
 });
}
