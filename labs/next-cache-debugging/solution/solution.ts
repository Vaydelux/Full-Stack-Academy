export function solve(age:number,maxAge:number){if(!Number.isFinite(age)||!Number.isFinite(maxAge)||age<0||maxAge<0)throw new TypeError('Invalid age');return age<=maxAge?'fresh':'stale';}
