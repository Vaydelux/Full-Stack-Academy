import React from 'react';
const schema={'@context':'https://schema.org','@type':'Course',name:'React Fundamentals',description:'Structured training with exercises'};
export default function CoursePage(){const text=JSON.stringify(schema).replace(/</g,'\\u003c');return <main><h1>React Fundamentals</h1><script type="application/ld+json" dangerouslySetInnerHTML={{__html:text}} /></main>;}
