import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Only for local loopback teaching. Never point the proxy at a public backend.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: { '/api': 'http://127.0.0.1:3337' },
  },
});
