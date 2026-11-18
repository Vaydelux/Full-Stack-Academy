export function solve(names:readonly string[],query:string){return names.filter(name=>name.toLowerCase().includes(query.trim().toLowerCase()));}
