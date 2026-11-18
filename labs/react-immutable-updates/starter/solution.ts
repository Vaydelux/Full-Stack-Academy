export function solve(rows:{id:string;qty:number}[],id:string,qty:number){const item=rows.find(x=>x.id===id);if(item)item.qty=qty;return rows;}
