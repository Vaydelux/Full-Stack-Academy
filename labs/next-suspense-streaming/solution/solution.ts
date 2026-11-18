export function solve(items:readonly {ready:boolean}[]):number{return items.filter(x=>x.ready).length;}
