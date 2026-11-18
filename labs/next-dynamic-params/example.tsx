import React from 'react';
import {notFound} from 'next/navigation';
// Example file: app/blog/[slug]/page.tsx
export default async function PostPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!/^[a-z0-9-]+$/.test(slug))notFound();return <main><h1>Post: {slug}</h1></main>;}
