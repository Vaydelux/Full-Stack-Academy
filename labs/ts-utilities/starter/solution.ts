type User={id:string;name:string;secret:string};export type Public=Pick<User,'id'|'name'>;export function solve(user:Readonly<User>):Public{return user;}
