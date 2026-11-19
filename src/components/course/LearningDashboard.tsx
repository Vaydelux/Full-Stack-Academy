'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Download, Search, Upload } from 'lucide-react';
import { useAcademy } from '@/lib/academy/store';
import { lessonMap, moduleMap } from '@/lib/academy/curriculum';
import { MDX_METADATA, PUBLISHED_LESSON_IDS } from '@/lib/academy/published';
import { createLearningOverview, type OverviewLesson } from '@/lib/academy/learning-overview';
import { StudyPlanPanel } from '@/components/course/StudyPlanPanel';

const publishedCatalog: OverviewLesson[] = PUBLISHED_LESSON_IDS.map((id) => {
  const item = lessonMap.get(id);
  const metadata = MDX_METADATA.get(id);
  return {
    id,
    moduleId: item?.moduleId ?? id.slice(0, 5),
    title: metadata?.title ?? item?.title ?? id,
    minutes: metadata?.estimatedMinutes ?? item?.estimatedMinutes ?? 0,
  };
});
const moduleTitles = Object.fromEntries([...moduleMap].map(([id, module]) => [id, module.title]));
type Filter = 'all' | 'unfinished' | 'completed';
const statStyle = 'rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.035]';
const buttonStyle = 'rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-colors hover:border-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-white/20';

export function LearningDashboard() {
  const hydrated = useAcademy((s) => s.hydrated);
  const hydrate = useAcademy((s) => s.hydrate);
  const progress = useAcademy((s) => s.progress);
  const exportBackupJson = useAcademy((s) => s.exportBackupJson);
  const importBackupJson = useAcademy((s) => s.importBackupJson);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [shown, setShown] = useState(18);
  const [acknowledgeReplace, setAcknowledgeReplace] = useState(false);
  const [feedback, setFeedback] = useState('');
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!hydrated) hydrate(); }, [hydrated, hydrate]);
  const overview = useMemo(
    () => createLearningOverview(publishedCatalog, progress, moduleTitles),
    [progress],
  );
  const visibleModules = useMemo(() => overview.modules.filter((module) => {
    if (filter === 'unfinished' && module.completed === module.lessons.length) return false;
    if (filter === 'completed' && module.completed !== module.lessons.length) return false;
    const needle = query.trim().toLocaleLowerCase();
    return !needle || module.id.toLowerCase().includes(needle) ||
      module.title.toLocaleLowerCase().includes(needle) ||
      module.lessons.some((item) => item.id.includes(needle) || item.title.toLocaleLowerCase().includes(needle));
  }), [overview, filter, query]);
  const completionPercent = overview.total === 0 ? 0 : Math.round(overview.completed * 100 / overview.total);

  function downloadBackup() {
    try {
      const content = exportBackupJson();
      if (new Blob([content]).size > 2_000_000) {
        setFeedback('Backup exceeds 2 MB. Shorten saved notes before exporting.');
        return;
      }
      const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'fullstack-academy-progress.json';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      setFeedback('Backup download prepared. Keep the file somewhere private.');
    } catch {
      setFeedback('Unable to prepare the backup on this device.');
    }
  }

  async function restoreBackup(file: File | undefined) {
    if (!file) return;
    try {
      if (!acknowledgeReplace) {
        setFeedback('Confirm that you understand the import will replace local progress.');
        return;
      }
      if (file.size > 2_000_000) {
        setFeedback('Backup exceeds the 2 MB import limit.');
        return;
      }
      const result = importBackupJson(await file.text());
      if (result.ok) {
        setAcknowledgeReplace(false);
        setFeedback('Validated backup imported. Local progress was replaced.');
      } else {
        setFeedback(result.error ?? 'The backup was rejected without changing your progress.');
      }
    } catch {
      setFeedback('Unable to read the selected backup. Local progress was not replaced.');
    } finally {
      if (uploadRef.current) uploadRef.current.value = '';
    }
  }

  if (!hydrated) {
    return <p role="status" className="mt-8 text-sm text-slate-500">Loading progress saved on this device…</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-extrabold uppercase tracking-[.2em] text-cyan-700 dark:text-cyan-300">Your learning workspace</p>
        <Link href="/learn" className="text-sm font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Browse curriculum</Link>
      </div>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Learning dashboard</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        A quieter way to continue your learning. Progress comes from your own knowledge checks and self-assessment, not automatic code grading. Everything here stays in this browser.
      </p>

      <section aria-label="Learning progress" className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className={statStyle}>
          <CheckCircle2 className="text-emerald-600 dark:text-emerald-300" size={21} aria-hidden="true" />
          <p className="mt-3 text-3xl font-extrabold tabular-nums">{overview.completed}<span className="text-base font-normal text-slate-500"> / {overview.total}</span></p>
          <p className="text-sm text-slate-500">Published lessons completed</p>
          <progress aria-label="Overall lesson completion" className="mt-3 h-2 w-full accent-cyan-600" max={overview.total || 1} value={overview.completed}/>
          <p className="text-xs text-slate-500">{completionPercent}% self-assessed complete</p>
        </div>
        <div className={statStyle}>
          <BookOpen className="text-cyan-700 dark:text-cyan-300" size={21} aria-hidden="true" />
          <p className="mt-3 text-3xl font-extrabold tabular-nums">{overview.started}</p>
          <p className="text-sm text-slate-500">Lessons started but unfinished</p>
          <p className="mt-3 text-xs text-slate-500">Based on quizzes, rubrics, notes or reflections.</p>
        </div>
        <div className={statStyle}>
          <Clock3 className="text-violet-700 dark:text-violet-300" size={21} aria-hidden="true" />
          <p className="mt-3 text-3xl font-extrabold tabular-nums">{overview.remainingMinutes.toLocaleString()}<span className="ml-1 text-base font-normal">min</span></p>
          <p className="text-sm text-slate-500">Estimated published reading and lab time remaining</p>
          <p className="mt-3 text-xs text-slate-500">Planning estimate, not a timer or deadline.</p>
        </div>
      </section>

      <section aria-labelledby="continue-heading" className="mt-7 rounded-2xl border border-cyan-600/30 bg-cyan-50 p-6 dark:bg-cyan-300/[0.055]">
        <h2 id="continue-heading" className="text-xl font-bold">Continue learning</h2>
        {overview.nextLesson ? (
          <>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Your next available lesson is:</p>
            <p className="mt-2 font-semibold">{overview.nextLesson.id} · {overview.nextLesson.title}</p>
            <Link className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-800" href={'/learn/' + overview.nextLesson.id}>
              Resume lesson <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </>
        ) : <p className="mt-2 text-sm">Every currently published lesson is marked complete. New lessons will appear here as the course grows.</p>}
      </section>

      <StudyPlanPanel />

      <section aria-labelledby="module-progress-heading" className="mt-10">
        <h2 id="module-progress-heading" className="text-xl font-bold">Your modules</h2>
        <p className="mt-2 text-sm text-slate-500">Search by topic or lesson ID, then jump into one module at a time.</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex min-w-56 flex-1 flex-col gap-1 text-xs font-semibold" htmlFor="dashboard-search">
            Find a module or lesson
            <span className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
              <input id="dashboard-search" value={query} onChange={(e) => { setQuery(e.target.value); setShown(18); }}
                type="search" placeholder="React, 06.01, HTTP…" className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-offset-2 focus-visible:outline-cyan-600 dark:border-white/20 dark:bg-[#15161c] dark:text-white" />
            </span>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold" htmlFor="dashboard-status-filter">Status
            <select id="dashboard-status-filter" value={filter} onChange={(e) => { setFilter(e.target.value as Filter); setShown(18); }}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-white/20 dark:bg-[#15161c]">
              <option value="all">All modules</option>
              <option value="unfinished">Not fully complete</option>
              <option value="completed">Complete</option>
            </select>
          </label>
        </div>
        <p role="status" className="my-3 text-xs text-slate-500">{visibleModules.length} matching modules · showing {Math.min(shown, visibleModules.length)}</p>
        {visibleModules.length === 0 ? <p className={statStyle}>No published modules match. Try a broader search or choose All modules.</p> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {visibleModules.slice(0, shown).map((module) => {
            const first = module.nextLesson ?? module.lessons[0];
            const full = module.completed === module.lessons.length;
            return (
              <article key={module.id} className={statStyle}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300">{module.id}</p>
                  <span className="text-xs tabular-nums text-slate-500">{module.completed}/{module.lessons.length} lessons</span>
                </div>
                <h3 className="mt-2 text-base font-bold">{module.title}</h3>
                <progress aria-label={module.title + ' completion'} value={module.completed} max={module.lessons.length || 1} className="mt-4 h-2 w-full accent-cyan-600" />
                <p className="mt-2 text-xs text-slate-500">{full ? 'All lessons self-assessed complete' : module.started + ' in progress · ~' + module.remainingMinutes + ' min remaining'}</p>
                <Link href={'/learn/' + first.id} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:underline dark:text-cyan-300">
                  {full ? 'Review module' : 'Open next lesson'} <ArrowRight size={15} aria-hidden="true"/>
                </Link>
              </article>
            );
          })}
        </div>
        {visibleModules.length > shown && (
          <button className={'mt-5 ' + buttonStyle} type="button" onClick={() => setShown((n) => n + 18)}>
            Show more modules
          </button>
        )}
      </section>

      <section aria-labelledby="backup-heading" className="mt-10 rounded-2xl border border-slate-200 p-5 dark:border-white/10">
        <h2 id="backup-heading" className="text-xl font-bold">Keep your progress</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Your notes, reflections, theme and self-assessed progress are stored in local browser storage. They do not sync across devices. Export a private JSON backup before clearing browser data.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={downloadBackup} className={'inline-flex items-center gap-2 ' + buttonStyle}><Download size={16} aria-hidden="true"/> Download backup</button>
        </div>
        <div className="mt-5 border-t border-slate-200 pt-5 dark:border-white/10">
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" checked={acknowledgeReplace} onChange={(e) => setAcknowledgeReplace(e.target.checked)} />
            I understand importing a backup will replace current local progress and notes.
          </label>
          <div className="mt-3">
            <button type="button" disabled={!acknowledgeReplace} className={'inline-flex items-center gap-2 ' + buttonStyle + ' disabled:cursor-not-allowed disabled:opacity-50'} onClick={() => uploadRef.current?.click()}>
              <Upload size={16} aria-hidden="true"/> Import validated JSON backup
            </button>
            <input aria-label="Select progress backup JSON" ref={uploadRef} type="file" accept=".json,application/json" className="sr-only"
              tabIndex={-1} onChange={(e) => void restoreBackup(e.target.files?.[0])} />
          </div>
          <p className="mt-2 text-xs text-slate-500">Limit: 2 MB. Unknown lessons and invalid completion records are discarded on import.</p>
        </div>
        {feedback && <p role="status" aria-live="polite" className="mt-4 text-sm font-semibold">{feedback}</p>}
      </section>
    </div>
  );
}
