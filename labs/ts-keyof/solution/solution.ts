export function solve<T extends object,K extends keyof T>(object:T,key:K):T[K]{return object[key];}
