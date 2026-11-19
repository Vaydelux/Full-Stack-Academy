import { StrictMode, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskWorkspace } from './workspace';
import './styles.css';

function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: {
    queries: { staleTime: 10_000, retry: (count, error) => count < 1 && !(error && 'status' in error && error.status === 400) },
    mutations: { retry: false },
  } }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
const host = document.getElementById('root');
if (!host) throw new Error('Missing root mount');
createRoot(host).render(<StrictMode><Providers><TaskWorkspace /></Providers></StrictMode>);
