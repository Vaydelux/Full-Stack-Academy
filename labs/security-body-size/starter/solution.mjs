export async function readBounded(chunks,_limit,declared){
 const data=[];for await(const chunk of chunks)data.push(Buffer.from(chunk));
 return Buffer.concat(data);
}
