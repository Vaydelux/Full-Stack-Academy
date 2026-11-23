import {createServer} from 'node:http';
import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';

const origin='http://academy.lab';
function respond(res,status,data){res.writeHead(status,{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data));}
function sign(body,key){return createHmac('sha256',key).update(body).digest('base64url');}
function cookieValue(raw){return (raw||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('academy_session='))?.slice('academy_session='.length);}
async function parseBody(req){
 const chunks=[];let size=0;
 for await (const part of req){size+=part.length;if(size>16384){const err=Error('oversized');err.status=413;throw err;}chunks.push(part);}
 try{const value=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!value||typeof value!=='object'||Array.isArray(value))throw Error();return value;}catch{const err=Error('bad_json');err.status=400;throw err;}
}
export function createHttpDbLab(repository,{now=()=>Date.now(),key=randomBytes(32)}={}){
 const sessions=new Map();
 function issue(userId,expiresIn=120000){
  if(!['alice','bob','viewer'].includes(userId))throw Error('unknown synthetic identity');
  const sid=randomBytes(16).toString('hex');sessions.set(sid,userId);
  const payload=Buffer.from(JSON.stringify({sid,exp:now()+expiresIn})).toString('base64url');
  return payload+'.'+sign(payload,key);
 }
 function principal(raw){
  const token=cookieValue(raw);if(typeof token!=='string')return null;
  const parts=token.split('.');if(parts.length!==2||!parts[0]||!parts[1])return null;
  const a=Buffer.from(parts[1]),b=Buffer.from(sign(parts[0],key));
  if(a.length!==b.length||!timingSafeEqual(a,b))return null;
  try{const v=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));return Number.isFinite(v.exp)&&v.exp>now()?sessions.get(v.sid)||null:null;}catch{return null;}
 }
 const server=createServer(async(req,res)=>{
  try{
   const path=new URL(req.url||'/', 'http://localhost').pathname;
   if(req.method==='GET'&&path==='/health')return respond(res,200,{ok:true});
   const actor=principal(req.headers.cookie);
   if(!actor)return respond(res,401,{error:'unauthenticated'});
   if(req.method!=='GET'&&req.headers.origin!==origin)return respond(res,403,{error:'invalid_origin'});
   const match=/^\/documents\/([a-z0-9-]{1,40})$/.exec(path);
   if(match&&['GET','PATCH','DELETE'].includes(req.method)){
    let action=req.method==='GET'?'read':req.method==='PATCH'?'update':'delete';
    let title='';
    if(action==='update'){
     const input=await parseBody(req);
     if(typeof input.title!=='string'||input.title.length<1||input.title.length>120)return respond(res,400,{error:'invalid_title'});
     title=input.title;
    }
    const record=await repository.action(action,{actor,docId:match[1],title});
    return respond(res,record?(action==='delete'?200:200):404,record||{error:'not_found'});
   }
   if(req.method==='POST'&&path==='/upload-intents'){
    const input=await parseBody(req);
    if(typeof input.documentId!=='string'||!/^[a-z0-9-]{1,40}$/.test(input.documentId))return respond(res,400,{error:'invalid_document'});
    if(input.contentType!=='application/pdf')return respond(res,415,{error:'unsupported_type'});
    const row=await repository.action('upload',{actor,docId:input.documentId});
    if(!row)return respond(res,404,{error:'not_found'});
    return respond(res,201,{storageKey:row.tenantId+'/'+row.documentId+'/'+randomBytes(12).toString('hex')+'.pdf',expiresAt:now()+60000});
   }
   return respond(res,404,{error:'not_found'});
  }catch(error){return respond(res,error?.status||500,{error:error?.status===400?'invalid_json':error?.status===413?'body_too_large':'internal_error'});}
 });
 return {server,issue,origin};
}
