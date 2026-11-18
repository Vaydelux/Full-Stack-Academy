export function solve(file:string,packageType:'module'|'commonjs'='module'):'esm'|'cjs'|null{return file.endsWith('.js')||file.endsWith('.mjs')||file.endsWith('.cjs')?'esm':null;}
