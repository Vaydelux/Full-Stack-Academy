export type Result={ok:true;value:string}|{ok:false;error:string};export function solve(input:unknown):Result{return {ok:false,error:String(input)};}
