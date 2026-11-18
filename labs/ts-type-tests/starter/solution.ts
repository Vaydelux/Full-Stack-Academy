export type First<T extends readonly unknown[]>=unknown;export function solve<T extends readonly unknown[]>(items:T):First<T>{return items[0];}
