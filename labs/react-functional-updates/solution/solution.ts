export function solve(initial:number,updates:readonly number[]):number{return updates.reduce((total,delta)=>total+delta,initial);}
