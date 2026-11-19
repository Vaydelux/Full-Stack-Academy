export function routeFromSegments(parts:readonly string[]){
 return '/'+parts.filter(Boolean).join('/');
}
export function RouteNotice({parts}:{parts:readonly string[]}){
 return <code>{routeFromSegments(parts)}</code>;
}
