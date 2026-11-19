export type RouteDecision={kind:'render';slug:string}|{kind:'redirect';to:string}|{kind:'notFound'};
export function decideGuide(slug:string):RouteDecision{
 if(slug==='react')return {kind:'render',slug};
 if(slug==='old-react')return {kind:'redirect',to:'/guides/react'};
 return {kind:'notFound'};
}
