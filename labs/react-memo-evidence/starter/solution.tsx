import {memo} from 'react';
export type Product={id:string;name:string;price:number};
export function equalProduct(a:Product,b:Product){return a.id===b.id;}
export const ProductCard=memo(function ProductCard({product}:{product:Product}){
 return <article><h2>{product.name}</h2><p>{product.price.toFixed(2)}</p></article>;
},(a,b)=>equalProduct(a.product,b.product));
