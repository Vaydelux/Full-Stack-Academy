export function solve(feature:{usesBrowser:boolean;hasEvents:boolean}):string{return feature.usesBrowser||feature.hasEvents?'client':'server';}
