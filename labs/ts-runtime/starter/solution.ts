type Product={priceCents:number};export function solve(raw:unknown):string{return (raw as Product).priceCents.toFixed(0);}
