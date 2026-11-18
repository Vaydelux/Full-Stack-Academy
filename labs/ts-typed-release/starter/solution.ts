export type Release={name:string;version:string;exports:string[]};export function solve(raw:Release){return {ok:true,entry:raw.exports[0]};}
