export type ItemDTO=Readonly<{id:string;qty:number}>;
export function parseItem(raw:unknown):ItemDTO|null{return raw as ItemDTO;}
