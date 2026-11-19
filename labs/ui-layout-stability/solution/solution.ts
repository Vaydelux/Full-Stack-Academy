export function solve(impact:number,distance:number):number{if([impact,distance].some(x=>!Number.isFinite(x)||x<0||x>1))throw new TypeError("Invalid fractions");return impact*distance;}
