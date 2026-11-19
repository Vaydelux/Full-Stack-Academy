export type Page={id:string;published:boolean;index:boolean;canonical:string;description:string};
export function auditPages(_pages:readonly Page[]):string[]{return [];}
