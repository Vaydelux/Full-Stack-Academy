export function solve<T extends object,K extends keyof T>(object:T,key:K):T[K]{return object[Object.keys(object)[0] as keyof T] as T[K];}
