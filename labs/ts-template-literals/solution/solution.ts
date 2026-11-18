export type Key=`course:${string}`|`topic:${string}`;export function solve(raw:string):raw is Key{return typeof raw==='string'&&(/^(course|topic):[^\s:][^\s]*$/.test(raw));}
