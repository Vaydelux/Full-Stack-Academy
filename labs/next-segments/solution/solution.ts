export function solve(segments:readonly string[]):string{return '/'+segments.filter(x=>x&&!/^\(.+\)$/.test(x)).map(encodeURIComponent).join('/');}
