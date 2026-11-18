export function solve(domain:string){if(!/^[a-z0-9-]{1,40}$/.test(domain))throw new TypeError('Invalid cache domain');return 'catalog:'+domain;}
