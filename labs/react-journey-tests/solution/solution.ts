export function solve(items:number,action:'checkout'|'add'){if(action==='add')return 'ready';return items>0?'submitted':'blocked';}
