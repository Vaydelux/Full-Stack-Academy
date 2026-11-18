export type Comment={id:string;text:string};export function solve(list:readonly Comment[],entry:Comment,ok:boolean){return [...list,entry,entry];}
