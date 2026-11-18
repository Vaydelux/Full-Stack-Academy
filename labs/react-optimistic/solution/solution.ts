export type Entry=Readonly<{id:string;text:string}>;export function solve(base:readonly Entry[],pending:Entry,accepted:boolean){return accepted?[...base,pending]:[...base];}
