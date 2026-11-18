import React from 'react';
import Image from 'next/image';
export default function AssetPage(){return <main><h1>Optimized assets</h1><Image src="/assets/cover.webp" alt="Illustrated web development course cover" width={960} height={540} sizes="(max-width: 700px) 100vw, 960px" /></main>;}
