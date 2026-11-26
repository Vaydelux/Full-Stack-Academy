import { publicOrigin } from './runtime-boundaries.mjs';

/**
 * Public canonical origin. Never guess a production hostname or render
 * localhost URLs into a publicly indexed sitemap.
 */
export function getPublicOrigin(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined);
  return publicOrigin(raw);
}
