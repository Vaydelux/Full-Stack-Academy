export type Product={slug:string;title:string};
export const products:readonly Product[]=[{slug:'starter-kit',title:'Starter kit'},{slug:'ui-handbook',title:'UI handbook'}];
export function findProduct(slug:string):Product|null{
 return products.find(product=>product.slug===slug)??null;
}
export function Catalogue(){return <ul>{products.map(product=><li key={product.slug}>{product.title}</li>)}</ul>;}
