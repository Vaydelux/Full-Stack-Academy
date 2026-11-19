import {Readable} from 'node:stream';
export async function collectBytes(input,maxBytes){
 const chunks=[];let size=0;
 for await(const value of Readable.from(input)){
  const text=String(value);size+=text.length;chunks.push(text);
 }
 return {size,content:chunks.join('')};
}
