export function solve(options:readonly {id:string;label:string}[],query:string):string[]{return options.map(x=>x.id);}
