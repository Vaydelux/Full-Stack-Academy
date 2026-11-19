export function solve(preferReduced:boolean,duration:number):number{if(!Number.isFinite(duration)||duration<0)throw new TypeError("Invalid motion duration");return preferReduced?0:duration;}
