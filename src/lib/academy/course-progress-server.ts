import 'server-only';
import { lessons, modules } from '@/lib/academy/curriculum';
import { PUBLISHED_LESSON_IDS } from '@/lib/academy/published';
import phaseDefinitions from '../../../data/publication-phases.json';
import { collectStagedManuscripts } from '../../../scripts/staged-inventory.mjs';
import { readingInventory } from '../../../scripts/reading-edition.mjs';
import { buildCurriculumAccess } from '../../../scripts/curriculum-access.mjs';
import { buildCourseProgress } from './course-progress-model';

function buildSnapshot() {
  const reading = readingInventory(collectStagedManuscripts(process.cwd(), { lessons }), PUBLISHED_LESSON_IDS);
  const byId = new Map(reading.map(record => [record.id, record]));
  const progress = buildCourseProgress(lessons, modules, PUBLISHED_LESSON_IDS, reading.map(record => record.id), phaseDefinitions);
  const access = buildCurriculumAccess(lessons, progress.publishedIds, progress.draftIds);
  return { byId, progress, access };
}
// Production source is immutable for the lifetime of a build/server instance.
// Development intentionally rescans so manuscript edits do not require a restart.
let snapshot: ReturnType<typeof buildSnapshot> | undefined;
function readSnapshot() {
  if (process.env.NODE_ENV !== 'production') return buildSnapshot();
  return snapshot ??= buildSnapshot();
}
export function readCourseProgress() { return readSnapshot().progress; }
export function readReadingLesson(id: string) { return readSnapshot().byId.get(id); }
export function readReadingIds() { return readSnapshot().progress.draftIds; }

export function readCurriculumAccess() { return readSnapshot().access; }
