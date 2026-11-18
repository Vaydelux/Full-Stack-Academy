export type Unwrap<T>=T extends PromiseLike<infer R>?R:T;export async function solve<T>(value:T|PromiseLike<T>):Promise<T>{return await value;}
