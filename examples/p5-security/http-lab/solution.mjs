
import {createServer} from "node:http";
import {createHmac,randomBytes,timingSafeEqual} from "node:crypto";
import {authorize} from "../policy.mjs";
// Disposable in-memory educational HTTP fixture; not a production auth or database service.
const origin="http://academy.local";
const sig=(data,key)=>createHmac("sha256",key).update(data).digest("base64url");
const reply=(res,status,data)=>{res.writeHead(status,{"content-type":"application/json","cache-control":"no-store","x-content-type-options":"nosniff"});res.end(JSON.stringify(data));};
function verify(raw,key,now){
 if(typeof raw!=="string")return null;
 const [body,signature,extra]=raw.split(".");if(!body||!signature||extra!==undefined)return null;
 const expected=sig(body,key),a=Buffer.from(signature),b=Buffer.from(expected);
 if(a.length!==b.length||!timingSafeEqual(a,b))return null;
 try{const v=JSON.parse(Buffer.from(body,"base64url").toString("utf8"));return Number.isFinite(v.exp)&&v.exp>now()?v:null;}catch{return null;}
}
async function body(req){
 const chunks=[];let size=0;
 for await(const chunk of req){size+=chunk.length;if(size>16384){const e=new Error("size");e.code=413;throw e;}chunks.push(chunk);}
 try{const value=JSON.parse(Buffer.concat(chunks).toString("utf8"));if(!value||typeof value!=="object"||Array.isArray(value))throw Error();return value;}
 catch{const e=new Error("json");e.code=400;throw e;}
}
export function createLab({now=()=>Date.now(),key=randomBytes(32)}={}){
 const users=new Map([
 ["alice",{id:"alice",active:true,memberships:[{tenantId:"alpha",role:"owner",active:true}]}],
 ["bob",{id:"bob",active:true,memberships:[{tenantId:"beta",role:"owner",active:true}]}],
 ["viewer",{id:"viewer",active:true,memberships:[{tenantId:"alpha",role:"viewer",active:true}]}]]);
 const docs=[{id:"alpha-1",tenantId:"alpha",title:"Alpha"},{id:"beta-1",tenantId:"beta",title:"Beta"}];
 const sessions=new Map();
 function issueSession(userId,ttl=120000){
  if(!users.has(userId))throw Error("unknown test user");
  const sid=randomBytes(16).toString("hex");sessions.set(sid,userId);
  const data=Buffer.from(JSON.stringify({sid,exp:now()+ttl})).toString("base64url");
  return data+"."+sig(data,key);
 }
 const server=createServer(async(req,res)=>{
  const method=req.method||"GET",path=new URL(req.url||"/","http://localhost").pathname;
  try{
   if(method==="GET"&&path==="/health")return reply(res,200,{ok:true});
   const raw=(req.headers.cookie||"").split(";").map(s=>s.trim()).find(s=>s.startsWith("academy_session="))?.slice(16);
   const payload=verify(raw,key,now),user=users.get(sessions.get(payload?.sid));
   if(!user?.active)return reply(res,401,{error:"unauthenticated"});
   if(method!=="GET"&&req.headers.origin!==origin)return reply(res,403,{error:"invalid_origin"});
   const match=/^\/documents\/([a-z0-9-]{1,40})$/.exec(path);
   if(match&&["GET","PATCH","DELETE"].includes(method)){
    const doc=docs.find(d=>d.id===match[1]);
    const action=method==="GET"?"read":method==="PATCH"?"write":"delete";
    if(!doc||!authorize({principal:user,resource:doc,action}))return reply(res,404,{error:"not_found"});
    if(method==="GET")return reply(res,200,{id:doc.id,title:doc.title});
    if(method==="DELETE"){doc.deleted=true;return reply(res,200,{deleted:true});}
    const value=await body(req);
    if(typeof value.title!=="string"||value.title.length<1||value.title.length>120)return reply(res,400,{error:"invalid_title"});
    doc.title=value.title;return reply(res,200,{id:doc.id,title:doc.title});
   }
   if(method==="POST"&&path==="/upload-intents"){
    const value=await body(req);
    if(typeof value.documentId!=="string"||!/^[a-z0-9-]{1,40}$/.test(value.documentId))return reply(res,400,{error:"invalid_intent"});
    if(value.contentType!=="application/pdf")return reply(res,415,{error:"unsupported_type"});
    const doc=docs.find(d=>d.id===value.documentId);
    if(!doc||!authorize({principal:user,resource:doc,action:"write"}))return reply(res,404,{error:"not_found"});
    return reply(res,201,{storageKey:doc.tenantId+"/"+doc.id+"/"+randomBytes(12).toString("hex")+".pdf",expiresAt:now()+60000});
   }
   return reply(res,404,{error:"not_found"});
  }catch(err){return reply(res,err.code===413?413:err.code===400?400:500,{error:err.code===413?"body_too_large":err.code===400?"invalid_json":"internal_error"});}
 });
 return {server,origin,users,docs,issueSession};
}
