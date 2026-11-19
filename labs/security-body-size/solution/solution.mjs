export async function readBounded(chunks,limit,declared){
 if(!Number.isSafeInteger(limit)||limit<0)throw new RangeError('Invalid limit');
 if(declared!==undefined&&(!Number.isSafeInteger(declared)||declared<0||declared>limit))throw new RangeError('Declared body too large');
 const data=[];let count=0;
 for await(const value of chunks){
  const chunk=Buffer.isBuffer(value)?value:Buffer.from(value);
  count+=chunk.byteLength;
  if(count>limit)throw new RangeError('Body too large');
  data.push(chunk);
 }
 if(declared!==undefined&&count!==declared)throw new RangeError('Mismatched length');
 return Buffer.concat(data);
}
