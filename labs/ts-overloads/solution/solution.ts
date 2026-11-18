export function solve(value:number):string;export function solve(value:string):string;export function solve(value:number|string):string{return typeof value==='number'?value.toFixed(2):value.trim();}
