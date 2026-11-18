export function solve(rows){rows.sort((a,b)=>a.name.localeCompare(b.name));return rows.map(x=>({name:x.name,total:x.qty*x.price}));}
