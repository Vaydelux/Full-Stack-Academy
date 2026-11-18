export function solve(items){items.sort((a,b)=>b.price-a.price);return {names:items.map(x=>x.name),total:items.reduce((s,x)=>s+x.price,1)};}
