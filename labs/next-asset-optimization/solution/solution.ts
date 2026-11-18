export function solve(name:string){if(!/^[a-z0-9][a-z0-9-]{0,70}\.(png|webp|jpg|jpeg|avif)$/.test(name))throw new TypeError('Invalid asset name');return '/assets/'+name;}
