type Event={createdAt:string};export function solve(raw:unknown):string{return new Date((raw as Event).createdAt).toISOString();}
