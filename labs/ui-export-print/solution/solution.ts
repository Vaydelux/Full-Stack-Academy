export function solve(value:string):string{const safe=/^[\s]*[=+@-]/.test(value)?"'"+value:value;return `"${safe.replace(/"/g,'""')}"`;}
