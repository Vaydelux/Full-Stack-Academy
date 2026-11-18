export function solve(required,checks,head){return required.every(name=>checks.some(c=>c.name===name&&c.status==='success'));}
