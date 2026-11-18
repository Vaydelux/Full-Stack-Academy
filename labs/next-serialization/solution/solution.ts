export function solve(raw:{id:string;displayName:string;secret:string}){if(!raw.id.trim())throw new TypeError('Missing ID');return {id:raw.id,displayName:raw.displayName.trim()};}
