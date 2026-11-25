/** Pure, browser-compatible boundaries. Never grant publication or execute sandbox code. */
export const BACKUP_MAX_BYTES=2_000_000;
export function publicOrigin(raw){
 if(typeof raw!=='string'||!/^https:\/\/[^/?#]/i.test(raw)||/[\s\\\x00-\x1f\x7f]/.test(raw))return undefined;
 try{
  const u=new URL(raw);
  if(u.protocol!=='https:'||u.username||u.password||u.pathname!=='/'||u.search||u.hash||!u.hostname)return undefined;
  const host=u.hostname.toLowerCase().replace(/\.$/,'');
  if(host==='localhost'||host.endsWith('.localhost')||host.endsWith('.local')||host==='[::1]'||/^127\./.test(host)||host==='0.0.0.0')return undefined;
  return u.origin;
 }catch{return undefined;}
}
export function readStoredProgress(read,decode,empty){
 try{
  const raw=read();
  if(raw===null)return {ok:true,data:empty};
  const data=decode(raw);
  return data===undefined?{ok:false}:{ok:true,data};
 }catch{return {ok:false};}
}
export function backupWithinLimit(raw){
 return typeof raw==='string'&&raw.length<=BACKUP_MAX_BYTES&&new TextEncoder().encode(raw).byteLength<=BACKUP_MAX_BYTES;
}
const levels=new Set(['log','info','warn','error']);
const boundedText=(value,limit)=>typeof value==='string'?value.slice(0,limit):'';
function safeHook(value,depth=0){
 if(value===null||typeof value==='boolean')return value;
 if(typeof value==='number')return Number.isFinite(value)?value:null;
 if(typeof value==='string')return value.slice(0,512);
 if(depth>=3||typeof value!=='object')return '[unsupported]';
 if(Array.isArray(value))return value.slice(0,16).map(v=>safeHook(v,depth+1));
 const result=Object.create(null);
 for(const key of Object.keys(value).slice(0,16)){
  if(key==='__proto__'||key==='constructor'||key==='prototype')continue;
  result[key.slice(0,128)]=safeHook(value[key],depth+1);
 }
 return result;
}
export function previewDiagnostic(value){
 if(!value||typeof value!=='object'||value.source!=='academy-preview')return null;
 switch(value.type){
  case 'READY':return {type:'READY'};
  case 'STATUS':return value.status==='ok'?{type:'STATUS',status:'ok'}:value.status==='error'?{type:'STATUS',status:'error',message:boundedText(value.message,4096)||'Unknown runtime error'}:null;
  case 'CONSOLE':return levels.has(value.level)&&typeof value.text==='string'?{type:'CONSOLE',level:value.level,text:boundedText(value.text,4096)}:null;
  case 'STATE':return Array.isArray(value.hooks)&&Number.isSafeInteger(value.renders)&&value.renders>=0?{type:'STATE',hooks:value.hooks.slice(0,16).map(v=>safeHook(v)),renders:Math.min(value.renders,1_000_000)}:null;
  default:return null;
 }
}
