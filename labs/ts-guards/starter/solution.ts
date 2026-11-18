type Person={name:string};export function solve(value:unknown):string{return (value as Person).name.toUpperCase();}
