export function solve(width:number):"table"|"cards"{if(!Number.isFinite(width)||width<0)throw new TypeError("Invalid width");return width<640?"cards":"table";}
