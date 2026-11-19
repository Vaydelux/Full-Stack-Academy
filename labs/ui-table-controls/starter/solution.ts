export function solve(items:readonly {id:string;title:string}[],query:string,page:number,size:number){return [...items].slice(page*size,(page+1)*size);}
