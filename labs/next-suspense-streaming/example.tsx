import React,{Suspense} from 'react';
async function SlowWidget(){const data=await Promise.resolve('Revenue panel ready');return <aside>{data}</aside>;}
export default function DashboardPage(){return <main><h1>Dashboard</h1><nav>Overview</nav><Suspense fallback={<p role="status">Loading widget…</p>}><SlowWidget /></Suspense></main>;}
