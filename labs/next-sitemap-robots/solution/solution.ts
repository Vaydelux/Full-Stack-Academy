export function solve(rows:readonly {id:string;published:boolean}[]):string[]{return rows.filter(x=>x.published&&/^\d{2}\.\d{2}\.\d{2}$/.test(x.id)).map(x=>'/learn/'+x.id);}
