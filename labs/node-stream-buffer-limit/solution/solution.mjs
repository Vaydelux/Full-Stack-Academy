import {Readable} from 'node:stream';
export async function collectBytes(input,maxBytes){
 if(!Number.isSafeInteger(maxBytes)||maxBytes<0)throw new RangeError('Invalid byte limit');
 const chunks=[];let size=0;
 for await(const value of Readable.from(input)){
  const chunk=Buffer.isBuffer(value)?value:Buffer.from(String(value));
  size+=chunk.byteLength;
  if(size>maxBytes)throw new RangeError('Body too large');
  chunks.push(chunk);
 }
 return {size,content:Buffer.concat(chunks).toString('utf8')};
}
