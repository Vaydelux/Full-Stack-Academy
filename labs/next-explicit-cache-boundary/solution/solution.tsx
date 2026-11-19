export function cacheScope(kind:'public'|'personalized'){
 return kind==='public'?'shared':'request';
}
