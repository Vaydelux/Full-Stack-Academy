export type Resource='catalogue'|'inbox'|'account';
export function sharedCacheCandidate(resource:Resource){return resource==='catalogue';}
