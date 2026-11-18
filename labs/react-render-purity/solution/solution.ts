export function solve(names:readonly string[]):string[]{return [...names].sort((a,b)=>a.localeCompare(b));}
