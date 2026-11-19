export type RouteDecision={kind:'render';slug:string}|{kind:'redirect';to:string}|{kind:'notFound'};
export function decideGuide(slug:string):RouteDecision{
 return slug==='react'?{kind:'render',slug}:{kind:'redirect',to:'/'};
}
