type Task={id:string;title:string;minutes:number;status:'todo'|'done'};export function solve(raw:unknown):Task{return raw as Task;}
