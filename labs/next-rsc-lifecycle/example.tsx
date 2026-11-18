import React,{Suspense} from 'react';
async function ServerData(){const value=await Promise.resolve('ready');return <p>Server data: {value}</p>;}
export default function StreamedPage(){return <main><h1>React Server Components</h1><Suspense fallback={<p>Loading article…</p>}><ServerData /></Suspense></main>;}
