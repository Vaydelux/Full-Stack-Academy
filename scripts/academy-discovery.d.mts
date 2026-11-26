export type DiscoveryRow = { id:string; title:string; context:string; summary?:string; status:string };
export type DiscoveryResult = DiscoveryRow & {kind:'lesson'|'reference'};
export function normalizeDiscoveryQuery(value:unknown):string;
export function searchAcademy(lessons:readonly DiscoveryRow[],references:readonly DiscoveryRow[],query:unknown,scope?:'all'|'lessons'|'references',page?:number):{total:number;items:DiscoveryResult[];page:number;pages:number};
