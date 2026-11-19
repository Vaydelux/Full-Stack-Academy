export function selectPage(rows:readonly string[],term:string,page:number,size:number){return rows.slice(page*size,(page+1)*size).filter(x=>x.includes(term));}
