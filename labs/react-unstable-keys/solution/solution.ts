export function solve(items:readonly {id:string}[]):string[]{const keys=items.map(x=>x.id);if(new Set(keys).size!==keys.length)throw new Error('Duplicate IDs');return keys;}
