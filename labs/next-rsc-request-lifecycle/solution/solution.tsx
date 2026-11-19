export type Phase='request'|'server-data'|'rsc'|'html'|'hydrate';
export function renderPhases():readonly Phase[]{return ['request','server-data','rsc','html','hydrate'];}
