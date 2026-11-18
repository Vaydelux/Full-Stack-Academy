export function solve(initial:number,updates:readonly number[]):number{return initial+(updates.at(-1)??0);}
