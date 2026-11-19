/**
 * Stateless course discovery and saved-lesson selectors.
 * Inputs must be the canonical PUBLISHED lesson catalog; never use the planned
 * curriculum catalog for actions that imply a lesson is already available.
 */
export interface DiscoverableLesson {
  id: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
  level: string;
  minutes: number;
  description?: string;
}

export interface DiscoverFilter {
  query?: string;
  moduleId?: string;
  level?: string;
  offset?: number;
  limit?: number;
}

export interface DiscoverResult {
  total: number;
  items: DiscoverableLesson[];
}

export interface SavedLessonState {
  bookmarks?: Record<string, boolean>;
  notes?: Record<string, string>;
  complete?: Record<string, boolean>;
}

export type SavedLessonKind = 'all' | 'bookmarked' | 'notes';

export interface SavedLesson extends DiscoverableLesson {
  bookmarked: boolean;
  hasNote: boolean;
  completed: boolean;
}

const text = (value: string) => value.toLocaleLowerCase('en').normalize('NFKC');
const cap = (value: number | undefined, defaultValue: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, Math.floor(value!))) : defaultValue;

/**
 * Accept bookmarks only for real published IDs and exact true values.
 * Iterates the trusted allowlist, not untrusted imported object keys.
 */
export function normalizeBookmarks(
  imported: Record<string, boolean> | undefined,
  publishedIds: readonly string[],
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  if (!imported || typeof imported !== 'object') return result;
  for (const id of publishedIds) {
    if (Object.hasOwn(imported, id) && imported[id] === true) {
      result[id] = true;
    }
  }
  return result;
}

function catalogDistinct(catalog: readonly DiscoverableLesson[]) {
  const seen = new Set<string>();
  return catalog.filter((lesson) => {
    if (!lesson.id || seen.has(lesson.id)) return false;
    seen.add(lesson.id);
    return true;
  });
}

/**
 * All search tokens must match some part of one published lesson. Results
 * rank exact/prefix IDs and titles first and otherwise keep canonical order.
 */
export function discoverPublishedLessons(
  catalog: readonly DiscoverableLesson[],
  options: DiscoverFilter = {},
): DiscoverResult {
  const search = text((options.query ?? '').slice(0, 160).trim());
  const tokens = search.split(/\s+/).filter(Boolean).slice(0, 8);
  const offset = cap(options.offset, 0, 0, 100_000);
  const limit = cap(options.limit, 12, 1, 1000);
  const matches = catalogDistinct(catalog)
    .map((lesson, index) => {
      const title = text(lesson.title);
      const id = text(lesson.id);
      const module = text(lesson.moduleTitle);
      const description = text(lesson.description ?? '');
      const haystack = [id, title, module, description, text(lesson.level), text(lesson.moduleId)].join(' ');
      if (options.moduleId && lesson.moduleId !== options.moduleId) return null;
      if (options.level && lesson.level !== options.level) return null;
      if (tokens.some(token => !haystack.includes(token))) return null;
      const score = search
        ? (id === search ? 120 : id.startsWith(search) ? 80 : 0) +
          (title === search ? 100 : title.startsWith(search) ? 60 : 0) +
          tokens.reduce((n, token) => n + (title.includes(token) ? 12 : module.includes(token) ? 5 : 0), 0)
        : 0;
      return { lesson, index, score };
    })
    .filter((match): match is { lesson: DiscoverableLesson; index: number; score: number } => match !== null);
  matches.sort((a, b) => b.score - a.score || a.index - b.index);
  return { total: matches.length, items: matches.slice(offset, offset + limit).map(m => m.lesson) };
}

/** Saved = bookmark or non-empty note. Never surface unknown IDs from backups. */
export function findSavedLessons(
  catalog: readonly DiscoverableLesson[],
  state: SavedLessonState,
  query = '',
  kind: SavedLessonKind = 'all',
): SavedLesson[] {
  const match = text(query.slice(0, 160).trim());
  const terms = match.split(/\s+/).filter(Boolean).slice(0, 8);
  return catalogDistinct(catalog).flatMap(lesson => {
    const bookmarked = state.bookmarks?.[lesson.id] === true;
    const hasNote = Boolean(state.notes?.[lesson.id]?.trim());
    if (!bookmarked && !hasNote) return [];
    if (kind === 'bookmarked' && !bookmarked) return [];
    if (kind === 'notes' && !hasNote) return [];
    const haystack = text([lesson.id, lesson.title, lesson.moduleTitle, lesson.description ?? ''].join(' '));
    if (terms.some(token => !haystack.includes(token))) return [];
    return [{
      ...lesson,
      bookmarked,
      hasNote,
      completed: state.complete?.[lesson.id] === true,
    }];
  });
}
