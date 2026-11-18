import React from 'react';
import Link from 'next/link';
export default function Navigation(){return <nav aria-label="Academy sections"><Link href="/learn" prefetch={false}>Lessons</Link><Link href="/reference">References</Link></nav>;}
