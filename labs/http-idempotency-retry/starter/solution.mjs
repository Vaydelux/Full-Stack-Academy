export function makeIdempotent(run){
 return async(_key,payload)=>run(payload);
}
