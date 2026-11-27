/** Only retain allowlisted source locations and bounded process exit metadata; never messages, values or raw logs. */
const allowed=/^(?:scripts\/(?:qualify-p4-evidence|p4-runtime-evidence)\.mjs|examples\/(?:p4-runtime\/(?:guard\.mjs|supabase\/(?:live|http|storage-denial)\.mjs)|p5-distributed-runtime\/(?:auth-session-live|session-lifecycle|supabase-live|run|guards)\.mjs))$/;
export function failureLocation(result){
 const frames=[];
 for(const m of String(result.stderr??'').matchAll(/(?:file:\/\/\/|\/)([^\s():]+):(\d{1,6}):(\d{1,5})/g)){
  const p=m[1],start=p.search(/(?:^|\/)(?:scripts|examples)\//);
  if(start<0)continue;
  const relative=p.slice(start).replace(/^\//,'');
  if(allowed.test(relative)&&frames.length<8)frames.push(relative+':'+m[2]+':'+m[3]);
 }
 return {exit:Number.isInteger(result.status)?result.status:null,interrupted:Boolean(result.signal||result.error),frames:[...new Set(frames)]};
}
export function safeNestedDiagnostic(stderr){
 const prefix='P4_CHILD_DIAGNOSTIC ';
 const line=String(stderr??'').split(/\r?\n/).find(l=>l.startsWith(prefix));
 if(!line)return null;
 try{
  const obj=JSON.parse(line.slice(prefix.length));
  if(!obj||!Array.isArray(obj.frames)||obj.frames.length>8||!obj.frames.every(f=>typeof f==='string'&&allowed.test(f.replace(/:\d{1,6}:\d{1,5}$/,''))&&/:\d{1,6}:\d{1,5}$/.test(f))||!(obj.exit===null||Number.isInteger(obj.exit))||typeof obj.interrupted!=='boolean')return null;
  return {exit:obj.exit,interrupted:obj.interrupted,frames:obj.frames};
 }catch{return null;}
}
