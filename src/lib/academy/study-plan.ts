/** A deterministic, browser-only study queue. No deadlines or server writes. */
export interface StudyPlanLesson {
  id: string;
  title: string;
  moduleId: string;
  minutes: number;
  prerequisites?: readonly string[];
}

export interface StudyPlanProgress {
  complete: Record<string, boolean>;
  quizzes: Record<string, boolean>;
  rubrics: Record<string, number[]>;
  notes: Record<string, string>;
  reflections: Record<string, string>;
}

export interface StudyPlanOptions {
  budgetMinutes: number;
  focusModule?: string;
  maxLessons?: number;
}

export interface StudyPlanResult {
  lessons: StudyPlanLesson[];
  totalMinutes: number;
  overBudget: boolean;
  remainingInScope: number;
  blockedInScope: number;
}

function started(id: string, progress: StudyPlanProgress): boolean {
  return progress.quizzes[id] === true ||
    (progress.rubrics[id]?.length ?? 0) > 0 ||
    Boolean(progress.notes[id]?.trim()) ||
    Boolean(progress.reflections[id]?.trim());
}

/**
 * A lesson is eligible only if its declared prerequisites are completed or
 * already scheduled. Unknown prerequisite IDs remain blocked (not bypassed).
 * Duration targets are suggestions; an oversized first lesson is a stretch goal.
 * Caller provides only published course lessons in canonical learning order.
 */
export function createStudyPlan(
  catalog: readonly StudyPlanLesson[],
  progress: StudyPlanProgress,
  options: StudyPlanOptions,
): StudyPlanResult {
  const budgetMinutes = Number.isFinite(options.budgetMinutes)
    ? Math.max(10, Math.min(240, Math.floor(options.budgetMinutes))) : 30;
  const maxLessons = Number.isFinite(options.maxLessons)
    ? Math.max(1, Math.min(12, Math.floor(options.maxLessons!))) : 4;
  const unique = new Map<string, StudyPlanLesson>();
  for (const candidate of catalog) {
    if (!candidate.id || unique.has(candidate.id)) continue;
    const minutes = Number.isFinite(candidate.minutes) && candidate.minutes > 0
      ? Math.max(1, Math.floor(candidate.minutes)) : 15;
    unique.set(candidate.id, { ...candidate, minutes });
  }
  const known = new Set(unique.keys());
  const done = new Set([...known].filter(id => progress.complete[id] === true));
  const scope = [...unique.values()].filter(item =>
    !done.has(item.id) && (!options.focusModule || item.moduleId === options.focusModule));
  const pending = new Map(scope.map(item => [item.id, item]));
  const queue: StudyPlanLesson[] = [];
  let totalMinutes = 0;
  const eligible = (item: StudyPlanLesson) => (item.prerequisites ?? [])
    .every(id => known.has(id) && done.has(id));

  for (let attempt = 0; attempt < maxLessons && pending.size; attempt++) {
    const ready = [...pending.values()].filter(eligible);
    if (!ready.length) break;
    // Keep catalog order within in-progress and not-started groups.
    ready.sort((a, b) => Number(started(b.id, progress)) - Number(started(a.id, progress)));
    const fit = ready.find(item => totalMinutes + item.minutes <= budgetMinutes);
    // Never suggest a course session with zero actions if at least one is ready.
    const candidate = fit ?? (queue.length === 0 ? ready[0] : undefined);
    if (!candidate) break;
    pending.delete(candidate.id);
    queue.push(candidate);
    totalMinutes += candidate.minutes;
    done.add(candidate.id); // scheduled prerequisite; completion state is never mutated
    if (totalMinutes >= budgetMinutes) break;
  }
  // Blocked covers items still missing prerequisite(s); over-budget eligible items are not blocked.
  const blockedInScope = [...pending.values()].filter(item => !eligible(item)).length;
  return {
    lessons: queue,
    totalMinutes,
    overBudget: totalMinutes > budgetMinutes,
    remainingInScope: scope.length,
    blockedInScope,
  };
}
