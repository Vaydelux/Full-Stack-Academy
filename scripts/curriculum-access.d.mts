export type CurriculumAccess = 'published' | 'reading' | 'planned';
export type AccessTopic<T> = T & { access: CurriculumAccess };
export function buildCurriculumAccess<T extends { id: string }>(topics: readonly T[], publishedIds: readonly string[], readingIds: readonly string[]): AccessTopic<T>[];
export function curriculumNeighbors<T extends { id: string; access: CurriculumAccess }>(catalog: readonly T[], currentId: string): { previous: T | null; next: T | null };
export function curriculumPrerequisites<T extends { id: string; access: CurriculumAccess }>(catalog: readonly T[], ids: readonly string[], currentId: string): T[];
export function filterCurriculumAccess<T extends { access?: CurriculumAccess }>(catalog: readonly T[], access: CurriculumAccess | 'all'): T[];
