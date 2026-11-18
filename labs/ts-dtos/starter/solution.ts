type DTO={id:string;priceCents:number;currency:string};export function solve(raw:unknown){const dto=raw as DTO;return {id:dto.id,price:dto.priceCents,currency:dto.currency};}
