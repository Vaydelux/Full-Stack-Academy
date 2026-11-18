export function solve(value){if(typeof value!=='string')throw new TypeError('String required');return '#filter='+encodeURIComponent(value.trim());}
