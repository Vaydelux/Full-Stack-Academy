import type { ReadingBlock } from './reading-edition.mjs';
export type AnchoredReadingBlock = ReadingBlock & { anchor?: string };
export function readingOutline(blocks: readonly ReadingBlock[], title: string): { blocks: AnchoredReadingBlock[]; outline: { id: string; label: string; level: number }[] };
export function readingModuleNavigation(topics: readonly { id: string; title: string; moduleId: string }[], publishedIds: readonly string[], readingIds: readonly string[], currentId: string): { id: string; title: string; edition: 'published' | 'reading'; active: boolean }[];
