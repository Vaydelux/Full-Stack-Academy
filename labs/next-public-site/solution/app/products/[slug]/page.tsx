import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
const products:Record<string,string>={'starter-kit':'Starter kit','ui-handbook':'UI handbook'};
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const title=products[slug];return {title:title?`${title} | Learning Store`:'Not found',robots:{index:Boolean(title)}};
}
export default async function ProductPage({params}:Props){
 const {slug}=await params;const title=products[slug];if(!title)notFound();
 return <main><h1>{title}</h1><p>Local-only sample product.</p></main>;
}
