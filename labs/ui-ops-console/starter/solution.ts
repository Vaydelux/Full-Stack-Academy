export type RecordRow={id:string;tenant:string;title:string};export function solve(rows:readonly RecordRow[],tenant:string):RecordRow[]{return [...rows];}
