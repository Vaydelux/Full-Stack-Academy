import type { MetadataRoute } from 'next';
import { AUTHORED_REFERENCES } from '@/lib/academy/authored-content';
import { PUBLISHED_LESSON_IDS } from '@/lib/academy/published';
import { tracks } from '@/lib/academy/curriculum';
import { getPublicOrigin } from '@/lib/academy/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getPublicOrigin();
  // Never publish incorrect localhost or example domains in a production sitemap.
  if (!origin) return [];
  const url = (path: string) => new URL(path, origin).toString();
  return [
    { url: url('/'), changeFrequency: 'weekly', priority: 1 },
    { url: url('/learn'), changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/reference'), changeFrequency: 'weekly', priority: 0.8 },
    ...tracks.map((track) => ({
      url: url(`/learn/track/${track.id}`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...PUBLISHED_LESSON_IDS.map((id) => ({
      url: url(`/learn/${id}`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...AUTHORED_REFERENCES.filter((ref) => ref.status !== 'Unverified draft').map((ref) => ({
      url: url(`/reference/${ref.id}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
