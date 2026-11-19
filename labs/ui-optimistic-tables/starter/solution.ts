export function solve<T extends {id:string}>(rows:readonly T[],id:string,approved:boolean):T[]{return rows.filter(x=>x.id!==id);}
