export type ItemDTO=Readonly<{id:string;qty:number}>;
export function parseItem(raw:unknown):ItemDTO|null{if(!raw||typeof raw!=='object'||!('id' in raw)||typeof raw.id!=='string'||!raw.id.trim()||!('qty' in raw)||typeof raw.qty!=='number'||!Number.isInteger(raw.qty)||raw.qty<0)return null;return Object.freeze({id:raw.id.trim(),qty:raw.qty});}
