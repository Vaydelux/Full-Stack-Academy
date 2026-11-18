export function solve(raw:unknown):string{return (raw as {id:string}).id.toUpperCase();}
