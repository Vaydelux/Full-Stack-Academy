export type Boundary='server'|'client';
export function detectBoundary(source:string):Boundary{
 const first=source.trimStart().split(/\r?\n/,1)[0].trim();
 return /^(['"])use client\1;?$/.test(first)?'client':'server';
}
export function BoundaryLabel({source}:{source:string}){return <p>{detectBoundary(source)}</p>;}
