import {Readable} from 'node:stream';
import {createHash} from 'node:crypto';
export async function digestUpload(chunks,maxBytes){
 if(!Number.isSafeInteger(maxBytes)||maxBytes<0)throw new RangeError('Invalid byte limit');
 const hash=createHash('sha256');let bytes=0;
 for await(const item of Readable.from(chunks)){
  const chunk=Buffer.isBuffer(item)?item:Buffer.from(item);
  bytes+=chunk.byteLength;
  if(bytes>maxBytes)throw new RangeError('Upload too large');
  hash.update(chunk);
 }
 return {bytes,sha256:hash.digest('hex')};
}
