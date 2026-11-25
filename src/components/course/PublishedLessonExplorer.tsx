'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { filterCurriculumAccess, type CurriculumAccess } from '../../../scripts/curriculum-access.mjs';
import { discoverPublishedLessons, type DiscoverableLesson } from '@/lib/academy/lesson-discovery';

const controlClass = 'min-w-0 max-w-full min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-offset-2 focus-visible:outline-cyan-600 dark:border-white/20 dark:bg-[#15161c] dark:text-slate-100';

export function PublishedLessonExplorer({ catalog, edition = 'published' }: { catalog: readonly DiscoverableLesson[]; edition?: 'published' | 'reading' | 'unified' }) {
  const reading = edition === 'reading';
  const unified = edition === 'unified';
  const [access, setAccess] = useState<CurriculumAccess | 'all'>('all');
  const [query, setQuery] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [level, setLevel] = useState('');
  const [visible, setVisible] = useState(12);
  const availableModules = useMemo(() => {
    const modules = new Map<string, string>();
    for (const item of catalog) {
      if (!modules.has(item.moduleId)) modules.set(item.moduleId, item.moduleTitle);
    }
    return [...modules.entries()];
  }, [catalog]);
  const levels = useMemo(() => [...new Set(catalog.map(item => item.level))].sort(), [catalog]);
  const result = useMemo(() => discoverPublishedLessons(unified ? filterCurriculumAccess(catalog, access) : catalog, {
    query, moduleId: moduleId || undefined, level: level || undefined, limit: visible,
  }), [catalog, query, moduleId, level, visible, unified, access]);
  const updateQuery = (value: string) => { setQuery(value); setVisible(12); };
  const updateModule = (value: string) => { setModuleId(value); setVisible(12); };
  const updateLevel = (value: string) => { setLevel(value); setVisible(12); };

  return (
    <section aria-labelledby="published-lesson-explorer-heading" className="mt-9">
      <h2 id="published-lesson-explorer-heading" className="text-xl font-bold">{unified ? 'Find any curriculum topic' : reading ? 'Find a reading edition' : 'Find a published lesson'}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
        Search by ID, topic, module or description. {unified ? 'Search published lessons, reading editions and planned topics. Only published lessons are eligible for course completion.' : reading ? 'Reading editions are not certified labs and do not record completion.' : 'Only authored, published lessons appear here; browse reading editions separately.'}
      </p>
      {unified && <label htmlFor="lesson-explorer-access" className="mt-4 flex max-w-xs flex-col gap-1.5 text-xs font-semibold">Learning availability
        <select id="lesson-explorer-access" value={access} onChange={e => { const value = e.target.value; if (value === 'all' || value === 'published' || value === 'reading' || value === 'planned') { setAccess(value); setVisible(12); } }} className={controlClass + ' w-full'}>
          <option value="all">All topics</option><option value="published">Published</option><option value="reading">Reading · lab pending</option><option value="planned">Planned</option>
        </select>
      </label>}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,235px)_minmax(0,165px)]">
        <label htmlFor="lesson-explorer-search" className="flex flex-col gap-1.5 text-xs font-semibold">
          Search lessons
          <span className="relative">
            <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input id="lesson-explorer-search" type="search" maxLength={160} value={query} onChange={e => updateQuery(e.target.value)}
              placeholder="e.g. React effects, 10.03.01" className={controlClass + ' w-full pl-10'} />
          </span>
        </label>
        <label htmlFor="lesson-explorer-module" className="flex flex-col gap-1.5 text-xs font-semibold">Module
          <select id="lesson-explorer-module" value={moduleId} onChange={e => updateModule(e.target.value)} className={controlClass}>
            <option value="">{unified ? 'All modules' : reading ? 'All reading modules' : 'All published modules'}</option>
            {availableModules.map(([id, name]) => <option key={id} value={id}>{id} · {name}</option>)}
          </select>
        </label>
        <label htmlFor="lesson-explorer-level" className="flex flex-col gap-1.5 text-xs font-semibold">Level
          <select id="lesson-explorer-level" value={level} onChange={e => updateLevel(e.target.value)} className={controlClass}>
            <option value="">All levels</option>
            {levels.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-xs text-slate-500">
          {result.total} matching {unified ? 'topics' : reading ? 'reading editions' : 'published lessons'} · showing {result.items.length}
        </p>
        {(query || moduleId || level || access !== 'all') && <button type="button" onClick={() => { setQuery(''); setModuleId(''); setLevel(''); setAccess('all'); setVisible(12); }}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-cyan-700 hover:underline focus-visible:outline-2 focus-visible:outline-cyan-600 dark:text-cyan-300">Clear filters</button>}
      </div>
      {result.total === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-5 text-sm dark:border-white/20">
          {unified ? 'No topics match. Clear a filter or try another search.' : reading ? 'No reading editions match. Try another topic or clear a filter.' : 'Nothing published matches. Try another topic, remove a filter or browse the curriculum below.'}
        </div>
      ) : (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {result.items.map(lesson => (
            <li key={lesson.id}>
              <Link href={'/learn/' + lesson.id}
                className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-white/10 dark:bg-white/[0.035]">
                <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-300">{lesson.id} · {lesson.level} · ~{lesson.minutes} min</p>
                <h3 className="mt-2 break-words font-bold">{lesson.title}</h3>
                {unified && <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{lesson.access === 'published' ? 'Published' : lesson.access === 'reading' ? 'Reading · lab pending' : 'Planned · not available'}</p>}
                <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-600 dark:text-slate-400">{lesson.description || lesson.moduleTitle}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-cyan-700 group-hover:underline dark:text-cyan-300">
                  {unified ? lesson.access === 'published' ? 'Open lesson' : lesson.access === 'reading' ? 'Read article' : 'View topic and references' : reading ? 'Read article · lab pending' : 'Open lesson'} <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {result.total > result.items.length && <button type="button" onClick={() => setVisible(n => n + 12)}
        className={controlClass + ' mt-5 font-semibold hover:border-cyan-500'}>
        Show more lessons ({result.total - result.items.length} remaining)
      </button>}
      <p className="mt-4 text-xs leading-5 text-slate-500">{unified ? 'Reading and planned topics never award course credit or enter the published sitemap.' : reading ? 'Reading editions are not included in the published sitemap or progress registry.' : 'All published lesson URLs remain included in the sitemap; search filters only change what is displayed here.'}</p>
    </section>
  );
}
