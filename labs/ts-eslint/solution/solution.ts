export function solve(raw:unknown):string{if(!raw||typeof raw!=='object'||!('id' in raw)||typeof raw.id!=='string')return 'INVALID';return raw.id.toUpperCase();}
