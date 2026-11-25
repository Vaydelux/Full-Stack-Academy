export function normalizeReference(value: string): string;
export function selectReferences<T extends { id: string; title: string; category: string }>(
  entries: readonly T[], authoredIds: readonly string[],
  options?: { query?: string; category?: string; visibility?: 'all' | 'authored' | 'indexed' }
): T[];
