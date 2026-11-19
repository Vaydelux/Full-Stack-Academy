import {createHash} from 'node:crypto';
export function makeIdempotent(run){
 const records=new Map();
 return async(key,payload)=>{
  if(typeof key!=='string'||!/^[A-Za-z0-9_-]{1,64}$/.test(key))throw new TypeError('Invalid idempotency key');
  const fingerprint=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  const existing=records.get(key);
  if(existing){
   if(existing.fingerprint!==fingerprint)return {status:409,conflict:true};
   return existing.promise;
  }
  const promise=Promise.resolve().then(()=>run(payload));
  records.set(key,{fingerprint,promise});
  try{return await promise;}catch(error){records.delete(key);throw error;}
 };
}
