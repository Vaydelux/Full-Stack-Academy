export type Patch<T>={readonly [K in keyof T]?:T[K]};export function solve<T extends object>(target:T,patch:Patch<T>):T{return {...target,...patch};}
