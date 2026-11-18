export type Result={ok:true;email:string}|{ok:false;error:string};export function solve(raw:unknown):Result{const user=raw as {email:string};return {ok:true,email:user.email.toLowerCase()};}
