export function solve(name:string){if(!/^[A-Z][A-Z0-9_]+$/.test(name))throw new TypeError('Invalid name');return !name.startsWith('NEXT_PUBLIC_');}
