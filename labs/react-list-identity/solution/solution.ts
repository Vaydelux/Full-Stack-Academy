export function solve(items:readonly {id:string}[]):string[]{const keys=items.map(x=>x.id);if(keys.some(x=>!x)||new Set(keys).size!==keys.length)throw new Error('Unique keys required');return keys;}
