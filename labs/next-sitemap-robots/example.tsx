import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{const origin='https://academy.example';return [{url:origin+'/learn/06.01.01',lastModified:new Date('2026-11-19T00:00:00.000Z'),changeFrequency:'monthly',priority:0.7}];}
