export function solve(href:string){if(!/^\/[a-z0-9/_-]*$/.test(href)||href.startsWith('//'))throw new TypeError('Unsafe local path');return href;}
