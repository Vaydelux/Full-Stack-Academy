export function solve(items:readonly {ready:boolean}[]):number{return items.every(x=>x.ready)?items.length:0;}
