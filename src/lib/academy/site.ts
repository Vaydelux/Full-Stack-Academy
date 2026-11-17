/**
 * Public canonical origin. Never guess a production hostname or render
 * localhost URLs into a publicly indexed sitemap.
 */
export function getPublicOrigin(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined);
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && url.hostname ? url.origin : undefined;
  } catch {
    return undefined;
  }
}
