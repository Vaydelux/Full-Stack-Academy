export function solve(spacing:number):number{if(!Number.isFinite(spacing)||spacing<0)throw new TypeError("Invalid spacing");return Math.round(spacing/4)*4;}
