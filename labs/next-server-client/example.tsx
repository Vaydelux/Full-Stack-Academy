import React from 'react';
// Example Server Component: app/articles/page.tsx
export default async function ArticlesPage(){const title=await Promise.resolve('Articles');return <main><h1>{title}</h1><p>This page needs no Client Component boundary.</p></main>;}
