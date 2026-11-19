export type PageKind='marketing'|'news'|'profile';
export function renderingStrategy(kind:PageKind){
 if(kind==='marketing')return 'static';
 if(kind==='news')return 'revalidated-public';
 return 'request-dynamic';
}
