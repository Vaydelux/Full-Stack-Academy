export function csvCell(value:string){const safe=/^[\s]*[=+\-@\t\r]/.test(value)?"'"+value:value;return /[",\r\n]/.test(safe)?'"'+safe.replace(/"/g,'""')+'"':safe;}
