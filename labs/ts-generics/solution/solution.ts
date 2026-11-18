export function solve<T extends {id:string}>(items:readonly T[],id:string):T|undefined{return items.find(item=>item.id===id);}
