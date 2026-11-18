import React from 'react';
import Image from 'next/image';
export default function Hero(){return <main><h1>Image optimization</h1><Image src="/academy-cover.webp" alt="Students studying web development" width={1200} height={630} sizes="(max-width: 640px) 100vw, 1200px" priority /></main>;}
