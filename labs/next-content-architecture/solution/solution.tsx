export type Section={id:string;title:string;published:boolean};
export function publicOutline(items:readonly Section[]){return items.filter(item=>item.published);}
