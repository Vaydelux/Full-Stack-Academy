export type State="loading"|"empty"|"ready"|"error";export function solve(state:State):string{return state==="ready"?"Results":"Loading…";}
