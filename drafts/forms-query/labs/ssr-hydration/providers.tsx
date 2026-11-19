'use client';
import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// A fresh client is scoped to this browser tree and not recreated on every render.
export default function Providers({children}:{children:ReactNode}){
 const [client]=useState(()=>new QueryClient({defaultOptions:{queries:{staleTime:30_000,retry:1}}}));
 return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
