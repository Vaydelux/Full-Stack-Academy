'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, CalendarRange } from 'lucide-react';
import { lessonMap, moduleMap } from '@/lib/academy/curriculum';
import { MDX_METADATA, PUBLISHED_LESSON_IDS } from '@/lib/academy/published';
import { useAcademy } from '@/lib/academy/store';
import { createStudyPlan, type StudyPlanLesson } from '@/lib/academy/study-plan';

const catalog: StudyPlanLesson[] = PUBLISHED_LESSON_IDS.map((id) => {
  const lesson = lessonMap.get(id);
  const meta = MDX_METADATA.get(id);
  return {
    id,
    title: meta?.title ?? lesson?.title ?? id,
    moduleId: lesson?.moduleId ?? id.slice(0, 5),
    minutes: meta?.estimatedMinutes ?? lesson?.estimatedMinutes ?? 15,
    prerequisites: lesson?.prerequisites ?? [],
  };
});
const availableModuleIds = [...new Set(catalog.map((item) => item.moduleId))];
const fieldClass = 'min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-white/20 dark:bg-[#15161c] dark:text-white';

export function StudyPlanPanel() {
  const progress = useAcademy((s) => s.progress);
  const [budgetMinutes, setBudgetMinutes] = useState(45);
  const [focusModule, setFocusModule] = useState('');
  const plan = useMemo(() => createStudyPlan(catalog, progress, {
    budgetMinutes,
    focusModule: focusModule || undefined,
    maxLessons: 4,
  }), [progress, budgetMinutes, focusModule]);
  const completed = useMemo(() => catalog.filter((lesson) => progress.complete[lesson.id] === true).length, [progress]);

  return (
    <section aria-labelledby="study-plan-heading" className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.035] sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-cyan-700/10 p-2.5 text-cyan-700 dark:text-cyan-300"><CalendarRange aria-hidden="true" size={21} /></div>
        <div>
          <h2 id="study-plan-heading" className="text-xl font-bold">Plan your next study session</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Choose the time you have, then follow a short lesson queue. Already-started lessons come first when prerequisites are met.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs font-bold" htmlFor="plan-budget">Time available
          <select id="plan-budget" className={fieldClass} value={budgetMinutes} onChange={(event) => setBudgetMinutes(Number(event.target.value))}>
            <option value={15}>15 minutes · Quick focus</option>
            <option value={30}>30 minutes · Short session</option>
            <option value={45}>45 minutes · Steady progress</option>
            <option value={60}>60 minutes · Deep practice</option>
            <option value={90}>90 minutes · Extended session</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-bold" htmlFor="plan-module">Focus area
          <select id="plan-module" className={fieldClass} value={focusModule} onChange={(event) => setFocusModule(event.target.value)}>
            <option value="">All published modules</option>
            {availableModuleIds.map((id) => <option value={id} key={id}>{id} · {moduleMap.get(id)?.title ?? id}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-5 dark:border-white/10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-bold">Your suggested queue</h3>
          <p role="status" aria-live="polite" className="text-xs tabular-nums text-slate-500">{plan.lessons.length} lessons · ~{plan.totalMinutes} min of {budgetMinutes} min</p>
        </div>
        {plan.lessons.length ? (
          <ol className="mt-3 space-y-2">
            {plan.lessons.map((lesson, index) => {
              const inProgress = Boolean(progress.quizzes[lesson.id] || progress.notes[lesson.id]?.trim() || progress.reflections[lesson.id]?.trim() || (progress.rubrics[lesson.id]?.length ?? 0));
              return (
                <li key={lesson.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold tabular-nums dark:bg-white/10">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-slate-500">{lesson.id} · ~{lesson.minutes} min {inProgress ? '· Started' : ''}</p>
                    <p className="mt-1 text-sm font-semibold">{lesson.title}</p>
                  </div>
                  <Link href={'/learn/' + lesson.id} aria-label={'Open ' + lesson.title} className="rounded-lg p-2 text-cyan-700 hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-cyan-600 dark:text-cyan-300 dark:hover:bg-white/10"><ArrowRight size={18} aria-hidden="true" /></Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="mt-3 rounded-xl border border-slate-200 p-4 text-sm dark:border-white/10">
            {plan.remainingInScope === 0 ? (
              <p>You have self-assessed every published lesson in this focus area as complete. Choose another module to continue.</p>
            ) : (
              <p>No eligible lessons in this focus area yet. Finish the published prerequisites first, or switch to All published modules.</p>
            )}
          </div>
        )}
        {plan.overBudget && <p className="mt-3 text-xs text-amber-800 dark:text-amber-200" role="note">The first eligible lesson is longer than your selected time. Treat it as a stretch goal; you can stop and resume later.</p>}
        {plan.blockedInScope > 0 && <p className="mt-3 text-xs text-slate-500">{plan.blockedInScope} more lessons are gated by prerequisite completion, including any prerequisite not yet published.</p>}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {plan.lessons[0] && <Link href={'/learn/' + plan.lessons[0].id} className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-800">
            <BookOpenCheck size={17} aria-hidden="true" /> Start suggested session
          </Link>}
          <span className="text-xs text-slate-500">{completed} completed · Plan is not saved or auto-graded</span>
        </div>
      </div>
    </section>
  );
}
