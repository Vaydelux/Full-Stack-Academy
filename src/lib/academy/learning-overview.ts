/**
 * Pure read model for the private, browser-only learner dashboard.
 * Only published lesson IDs should be passed as the catalog argument.
 * No wall-clock estimates, cloud sync, or automated grading are implied.
 */
export interface OverviewLesson {
  id: string;
  moduleId: string;
  title: string;
  minutes: number;
}

export interface OverviewProgress {
  complete: Record<string, boolean>;
  quizzes: Record<string, boolean>;
  rubrics: Record<string, number[]>;
  notes: Record<string, string>;
  reflections: Record<string, string>;
}

export interface OverviewModule {
  id: string;
  title: string;
  lessons: OverviewLesson[];
  completed: number;
  started: number;
  remainingMinutes: number;
  nextLesson: OverviewLesson | null;
}

export interface LearningOverview {
  total: number;
  completed: number;
  started: number;
  remainingMinutes: number;
  nextLesson: OverviewLesson | null;
  modules: OverviewModule[];
}

function isStarted(id: string, progress: OverviewProgress): boolean {
  return progress.quizzes[id] === true ||
    (progress.rubrics[id]?.length ?? 0) > 0 ||
    Boolean(progress.notes[id]?.trim()) ||
    Boolean(progress.reflections[id]?.trim());
}

/** Counts only distinct, known published lessons, never arbitrary backup keys. */
export function createLearningOverview(
  catalog: readonly OverviewLesson[],
  progress: OverviewProgress,
  moduleTitles: Readonly<Record<string, string>> = {},
): LearningOverview {
  const byModule = new Map<string, OverviewModule>();
  const seen = new Set<string>();
  let total = 0;
  let completed = 0;
  let started = 0;
  let remainingMinutes = 0;
  let firstUnfinished: OverviewLesson | null = null;
  let firstInProgress: OverviewLesson | null = null;

  for (const item of catalog) {
    if (!item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    const minutes = Number.isFinite(item.minutes) && item.minutes > 0 ? Math.floor(item.minutes) : 0;
    const lesson: OverviewLesson = { ...item, minutes };
    const done = progress.complete[item.id] === true;
    const inProgress = !done && isStarted(item.id, progress);
    let moduleOverview = byModule.get(item.moduleId);
    if (!moduleOverview) {
      moduleOverview = {
        id: item.moduleId,
        title: moduleTitles[item.moduleId] ?? item.moduleId,
        lessons: [],
        completed: 0,
        started: 0,
        remainingMinutes: 0,
        nextLesson: null,
      };
      byModule.set(item.moduleId, moduleOverview);
    }
    moduleOverview.lessons.push(lesson);
    total++;
    if (done) {
      completed++;
      moduleOverview.completed++;
    } else {
      remainingMinutes += minutes;
      moduleOverview.remainingMinutes += minutes;
      if (!moduleOverview.nextLesson || (inProgress && !isStarted(moduleOverview.nextLesson.id, progress))) {
        moduleOverview.nextLesson = lesson;
      }
      if (!firstUnfinished) firstUnfinished = lesson;
      if (inProgress) {
        started++;
        moduleOverview.started++;
        if (!firstInProgress) firstInProgress = lesson;
      }
    }
  }

  return {
    total,
    completed,
    started,
    remainingMinutes,
    nextLesson: firstInProgress ?? firstUnfinished,
    modules: [...byModule.values()],
  };
}
