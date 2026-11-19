import Link from 'next/link';
const products=[{slug:'starter-kit',title:'Starter kit'},{slug:'ui-handbook',title:'UI handbook'}];
export default function HomePage(){
 return <main><h1>Learning Store</h1><ul>{products.map(product=><li key={product.slug}>
 <Link href={`/products/${product.slug}`}>{product.title}</Link></li>)}</ul></main>;
}
