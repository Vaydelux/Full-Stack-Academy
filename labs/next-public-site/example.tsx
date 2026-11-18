import React from 'react';
import Link from 'next/link';
import type {Metadata} from 'next';
export const metadata:Metadata={title:'Public Academy',description:'Accessible public site route demonstration.'};
export default function PublicSite(){return <main><h1>Public Academy</h1><nav aria-label="Site navigation"><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav><p>Build verified public routes.</p></main>;}
