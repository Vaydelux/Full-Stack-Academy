export function solve(rows:readonly {id:string;published:boolean}[]):string[]{return rows.map(x=>'/learn/'+x.id);}
