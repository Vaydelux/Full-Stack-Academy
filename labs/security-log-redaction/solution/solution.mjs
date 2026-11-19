const PRIVATE=new Set(['authorization','cookie','set-cookie','password','passwd','token','access_token','refresh_token','apikey','api_key','secret']);
export function redactLog(value){
 const visit=(data,seen)=>{
  if(!data||typeof data!=='object')return data;
  if(seen.has(data))return '[Circular]';
  seen.add(data);
  const output=Array.isArray(data)?data.map(item=>visit(item,seen)):Object.fromEntries(Object.entries(data).map(([k,v])=>[k,PRIVATE.has(k.toLowerCase())?'[REDACTED]':visit(v,seen)]));
  seen.delete(data);
  return output;
 };
 return visit(value,new WeakSet());
}
