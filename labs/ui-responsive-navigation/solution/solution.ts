export function solve(width:number):"compact"|"full"{if(!Number.isFinite(width)||width<0)throw new TypeError("Invalid viewport");return width<768?"compact":"full";}
