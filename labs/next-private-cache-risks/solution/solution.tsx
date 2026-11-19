export type Visibility='public'|'organization'|'private';
export function mayUseSharedCache(visibility:Visibility){return visibility==='public';}
