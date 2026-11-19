export function solve(size:number):number{if(!Number.isFinite(size)||size<0)throw new TypeError("Invalid font size");return Math.max(16,size);}
