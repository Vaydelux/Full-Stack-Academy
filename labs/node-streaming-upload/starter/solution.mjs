import {Readable} from 'node:stream';
import {createHash} from 'node:crypto';
export async function digestUpload(chunks,_maxBytes){
 const hash=createHash('sha256');let bytes=0;
 for await(const item of Readable.from(chunks)){
  const chunk=Buffer.from(item);bytes+=chunk.length;hash.update(chunk);
 }
 return {bytes,sha256:hash.digest('hex')};
}
