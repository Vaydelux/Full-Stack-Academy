export function parseJsonObject(raw,maxBytes=1024){
 if(typeof raw!=='string'||!Number.isSafeInteger(maxBytes)||maxBytes<1)throw new TypeError('Invalid input');
 if(Buffer.byteLength(raw)>maxBytes)throw new RangeError('Body too large');
 const parsed=JSON.parse(raw);
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new TypeError('Expected object');
 const check=value=>{
  if(!value||typeof value!=='object')return;
  for(const key of Object.keys(value)){
   if(['__proto__','constructor','prototype'].includes(key))throw new TypeError('Unsafe key');
   check(value[key]);
  }
 };
 check(parsed);return parsed;
}
