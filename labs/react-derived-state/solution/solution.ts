export function solve(items:readonly {price:number;qty:number}[]):number{return items.reduce((sum,item)=>sum+item.price*item.qty,0);}
