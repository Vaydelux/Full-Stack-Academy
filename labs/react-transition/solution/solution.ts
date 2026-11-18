export function solve(items:readonly string[],query:string):string[]{const normalized=query.trim().toLowerCase();return items.filter(item=>item.toLowerCase().includes(normalized));}
