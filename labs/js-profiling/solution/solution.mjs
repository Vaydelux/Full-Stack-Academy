export function solve(values){if(!Array.isArray(values)||values.some(x=>!Number.isFinite(x)))throw new TypeError('Numbers required');return {sum:values.reduce((a,b)=>a+b,0),count:values.length};}
