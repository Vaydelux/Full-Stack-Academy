export function lessonNeighbors<T extends { id: string; moduleId: string }>(
  lessons: readonly T[], publishedIds: readonly string[], currentId: string
): { previous: T | null; next: T | null };
