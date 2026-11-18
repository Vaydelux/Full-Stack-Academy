export type Key=`course:${string}`|`topic:${string}`;export function solve(raw:string):raw is Key{return raw.includes(':');}
