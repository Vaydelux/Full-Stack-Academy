import type {Row} from './types';export function solve(rows:readonly Row[]):string[]{return [...rows].sort((a,b)=>a.name.localeCompare(b.name)).map(r=>r.name);}
