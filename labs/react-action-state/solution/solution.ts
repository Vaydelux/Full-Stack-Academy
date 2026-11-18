export function solve(previous:{error:string},name:string){const normalized=name.trim();return normalized.length>=2?{error:'',saved:normalized}:{error:'Enter at least two characters',saved:''};}
