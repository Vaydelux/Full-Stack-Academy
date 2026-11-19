'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookmarkCheck, NotebookPen, Search } from 'lucide-react';
import { useAcademy } from '@/lib/academy/store';
import {
  findSavedLessons, type DiscoverableLesson, type SavedLessonKind,
} from '@/lib/academy/lesson-discovery';

const controlClass = 'min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-white/20 dark:bg-[#15161c] dark:text-slate-100';

export function SavedLessonShelf({ catalog }: { catalog: readonly DiscoverableLesson[] }) {
  const progress = useAcademy(s => s.progress);
  const hydrated = useAcademy(s => s.hydrated);
  const storageError = useAcademy(s => s.storageError);
  const toggleBookmark = useAcademy(s => s.toggleBookmark);
  const [filter, setFilter] = useState<SavedLessonKind>('all');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(8);
  const entries = useMemo(() => findSavedLessons(catalog, progress, query, filter), [catalog, progress, query, filter]);

  return (
    <section id="saved-lessons" aria-labelledby="saved-lessons-heading" className="mt-10 scroll-mt-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="saved-lessons-heading" className="text-xl font-bold">Your saved lessons and notes</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Return to bookmarked lessons and notes without finding them again in the course catalog. This list is private to this browser.</p>
        </div>
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs tabular-nums text-slate-500 dark:border-white/15">{entries.length} matches</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(175px,220px)]">
        <label htmlFor="saved-search" className="flex flex-col gap-1.5 text-xs font-semibold">
          Search saved work
          <span className="relative">
            <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="search" id="saved-search" value={query} onChange={e => { setQuery(e.target.value); setVisible(8); }}
              placeholder="Topic, module, or lesson ID" className={controlClass + ' w-full pl-10'} />
          </span>
        </label>
        <label htmlFor="saved-kind" className="flex flex-col gap-1.5 text-xs font-semibold">Show
          <select id="saved-kind" value={filter} className={controlClass} onChange={e => { setFilter(e.target.value as SavedLessonKind); setVisible(8); }}>
            <option value="all">All saved work</option>
            <option value="bookmarked">Bookmarked lessons</option>
            <option value="notes">Lessons with notes</option>
          </select>
        </label>
      </div>
      {!hydrated ? (
        <p role="status" className="mt-4 text-sm text-slate-500">Loading saved lessons on this device…</p>
      ) : entries.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm leading-6 dark:border-white/20 dark:bg-white/[0.025]">
          {query || filter !== 'all'
            ? 'No saved lessons match these filters. Adjust the search or show all saved work.'
            : 'Nothing saved yet. Open any published lesson and select Save lesson, or write a private study note to see it here.'}
          <Link href="/learn" className="mt-3 block font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Explore published lessons</Link>
        </div>
      ) : (
        <>
          <ol className="mt-4 grid gap-3 md:grid-cols-2">
            {entries.slice(0, visible).map(entry => (
              <li key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.035]">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[11px] font-semibold text-cyan-700 dark:text-cyan-300">{entry.id} · {entry.moduleTitle}</p>
                  {entry.completed && <span className="shrink-0 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Self-assessed complete</span>}
                </div>
                <h3 className="mt-2 text-sm font-bold">{entry.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  {entry.bookmarked && <span className="inline-flex items-center gap-1"><BookmarkCheck size={14} aria-hidden="true" /> Bookmarked</span>}
                  {entry.hasNote && <span className="inline-flex items-center gap-1"><NotebookPen size={14} aria-hidden="true" /> Has note</span>}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link href={'/learn/' + entry.id + '#lesson-tools'} className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:underline dark:text-cyan-300">
                    Open lesson <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                  {entry.bookmarked && (
                    <button type="button" disabled={!hydrated} onClick={() => toggleBookmark(entry.id)}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-cyan-600 dark:text-slate-300">
                      Remove bookmark
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
          {entries.length > visible && <button type="button" onClick={() => setVisible(n => n + 8)}
            className={controlClass + ' mt-4 font-semibold hover:border-cyan-500'}>
            Show more saved lessons ({entries.length - visible} remaining)
          </button>}
        </>
      )}
      {storageError && <p role="alert" className="mt-4 text-sm text-rose-700 dark:text-rose-300">Browser storage could not save your latest change. It may be lost after this session.</p>}
    </section>
  );
}
