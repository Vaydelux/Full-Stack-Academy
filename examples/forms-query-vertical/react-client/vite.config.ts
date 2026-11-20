import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Only for local loopback teaching. Never point the proxy at a public backend.
export default defineConfig({
  plugins: [react()],
  // The standalone client uses plain CSS and must not load Next's parent config.
  css: { postcss: { plugins: [] } },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3337',
        changeOrigin: true,
        // A same-origin browser POST to Vite has Origin :5173; the local
        // upstream validates :3337. Translate only the trusted Vite origin.
        configure(proxy) {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers.origin === 'http://127.0.0.1:5173') {
              proxyReq.setHeader('origin', 'http://127.0.0.1:3337');
            }
          });
        },
      },
    },
  },
});
