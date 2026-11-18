export type State='loading'|'error'|'ready';export function solve(state:State){return state==='loading'?'Loading…':'Ready';}
