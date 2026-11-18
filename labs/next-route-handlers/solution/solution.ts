export function solve(input:string){if(!/^[a-z0-9-]{1,50}$/.test(input))throw new TypeError('Invalid local resource ID');return '/api/products/'+encodeURIComponent(input);}
