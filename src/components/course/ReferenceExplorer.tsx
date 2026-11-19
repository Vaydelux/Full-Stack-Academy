'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ReferenceSubject } from '@/lib/academy/types';

type Visibility = 'all' | 'authored' | 'indexed';

export function ReferenceExplorer({
  entries,
  categories,
  authoredIds,
}: {
  entries: ReferenceSubject[];
  categories: string[];
  authoredIds: string[];
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [visibility, setVisibility] = useState<Visibility>('all');
  const [limit, setLimit] = useState(36);
  const authoredSet = useMemo(() => new Set(authoredIds), [authoredIds]);

  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return entries
      .filter((entry) => {
        const hasDraft = authoredSet.has(entry.id);
        if (category !== 'all' && entry.category !== category) return false;
        if (visibility === 'authored' && !hasDraft) return false;
        if (visibility === 'indexed' && hasDraft) return false;
        if (!term) return true;
        return `${entry.title} ${entry.category} ${entry.id}`.toLocaleLowerCase().includes(term);
      })
      .sort((left, right) => {
        const publicationRank = Number(authoredSet.has(right.id)) - Number(authoredSet.has(left.id));
        return publicationRank || left.title.localeCompare(right.title);
      });
  }, [entries, query, category, visibility, authoredSet]);

  const visible = results.slice(0, limit);
  function reset() {
    setQuery(''); setCategory('all'); setVisibility('all'); setLimit(36);
  }

  return (
    <section aria-label="Browse technical references">
      <div className="mt-7 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 sm:p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="sm:col-span-2">
          <label htmlFor="reference-search" className="mb-2 block text-sm font-semibold">Find a reference</label>
          <input
            id="reference-search"
            type="search"
            autoComplete="off"
            placeholder="Search a hook, function, property or topic"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setLimit(36); }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 dark:border-white/20 dark:bg-slate-950 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="reference-category" className="mb-2 block text-sm font-semibold">Category</label>
          <select
            id="reference-category"
            value={category}
            onChange={(event) => { setCategory(event.target.value); setLimit(36); }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/20 dark:bg-slate-950 dark:text-white"
          >
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="reference-status" className="mb-2 block text-sm font-semibold">Reference status</label>
          <select
            id="reference-status"
            value={visibility}
            onChange={(event) => { setVisibility(event.target.value as Visibility); setLimit(36); }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/20 dark:bg-slate-950 dark:text-white"
          >
            <option value="all">All entries</option>
            <option value="authored">Authored drafts only</option>
            <option value="indexed">Indexed only</option>
          </select>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <h2 id="references-results" className="text-lg font-bold">Results</h2>
        <p role="status" aria-live="polite" className="text-sm text-slate-600 dark:text-slate-300">
          {results.length} matching {results.length === 1 ? 'entry' : 'entries'} · {visible.length} shown
        </p>
        <button type="button" onClick={reset} className="rounded-lg px-3 py-2 text-sm font-semibold text-cyan-700 underline-offset-4 hover:underline focus-visible:outline-2 dark:text-cyan-300">
          Reset filters
        </button>
      </div>

      {results.length === 0 ? (
        <div role="status" className="mt-4 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600 dark:border-white/20 dark:text-slate-300">
          No matching references. Try another term or reset the filters.
        </div>
      ) : (
        <ul aria-labelledby="references-results" className="mt-4 grid gap-3 sm:grid-cols-2">
          {visible.map((item) => {
            const hasDraft = authoredSet.has(item.id);
            return (
              <li key={item.id}>
                <Link
                  href={`/reference/${item.id}`}
                  className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400"
                >
                  <span className="min-w-0 break-words text-sm font-semibold text-slate-900 dark:text-white">{item.title}</span>
                  <span className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <span>{item.category}</span>
                    <span>{hasDraft ? 'Authored draft' : 'Index only'}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {results.length > visible.length && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((current) => current + 36)}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-white/20 dark:hover:bg-white/10"
          >
            Show more references
          </button>
        </div>
      )}
    </section>
  );
}
