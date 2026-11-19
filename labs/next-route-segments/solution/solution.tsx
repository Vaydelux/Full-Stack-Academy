export function routeFromSegments(parts:readonly string[]){
 const segments=parts.filter(s=>s&&!/^\([^/]+\)$/.test(s)&&s!=='page.tsx');
 return '/'+segments.join('/');
}
export function RouteNotice({parts}:{parts:readonly string[]}){
 return <code>{routeFromSegments(parts)}</code>;
}
