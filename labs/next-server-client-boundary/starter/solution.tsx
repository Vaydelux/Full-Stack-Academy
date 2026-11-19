export type Boundary='server'|'client';
export function detectBoundary(_source:string):Boundary{return 'client';}
export function BoundaryLabel({source}:{source:string}){return <p>{detectBoundary(source)}</p>;}
