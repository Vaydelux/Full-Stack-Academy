import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Only lesson manuscripts and paired metadata, never lab sources or local credentials.
  outputFileTracingIncludes: {
    '/learn/**': ['./drafts/*/lessons/*.mdx', './drafts/*/lessons/*.meta.json'],
    '/learn': ['./drafts/*/lessons/*.mdx', './drafts/*/lessons/*.meta.json'],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Opaque-origin iframe module imports require explicit CORS.
        source: '/preview-vendor.mjs',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },
      {
        source: '/preview.html',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

const withMDX = createMDX({ extension: /\.mdx?$/ });
export default withMDX(nextConfig);
