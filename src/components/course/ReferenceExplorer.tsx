'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { filterReferenceEntries, groupReferenceEntries, type ReferenceSearchEntry } from '@/lib/academy/reference-filter';

export function ReferenceExplorer({entries}: {entries: readonly ReferenceSearchEntry[]}) {
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('all');
  const [authoredOnly,setAuthoredOnly]=useState(false);
  const categories=useMemo(()=>[...new Set(entries.map(e=>e.category))].sort(),[entries]);
  const filtered=useMemo(()=>filterReferenceEntries(entries,{query,category,authoredOnly}),[entries,query,category,authoredOnly]);
  const grouped=useMemo(()=>groupReferenceEntries(filtered),[filtered]);
  const filteredDrafts=filtered.filter(e=>e.authored).length;
  const filtersActive=Boolean(query.trim())||category!=='all'||authoredOnly;
  const reset=()=>{setQuery('');setCategory('all');setAuthoredOnly(false);};

  return (
    <section aria-label="Search developer references" className="mt-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(160px,220px)]">
          <div>
            <label htmlFor="reference-search" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Search by API, hook or concept</label>
            <input id="reference-search" type="search" autoComplete="off" value={query}
              onChange={event=>setQuery(event.target.value)}
              placeholder="e.g. useEffect, proxy, cacheTag"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-offset-2 focus-visible:outline-2 focus-visible:outline-cyan-600 dark:border-white/20 dark:bg-slate-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="reference-category" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Category</label>
            <select id="reference-category" value={category} onChange={event=>setCategory(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-cyan-600 dark:border-white/20 dark:bg-slate-900 dark:text-white">
              <option value="all">All categories</option>
              {categories.map(value=><option key={value} value={value}>{value}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={authoredOnly} onChange={event=>setAuthoredOnly(event.target.checked)}
              className="h-4 w-4 accent-cyan-700" />
            Detailed references only
          </label>
          {filtersActive&&<button type="button" onClick={reset} className="rounded-md px-3 py-1.5 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-cyan-600 dark:text-cyan-300 dark:hover:bg-cyan-950">Clear filters</button>}
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300" role="status" aria-live="polite" aria-atomic="true">
        Showing {filtered.length} of {entries.length} subjects · {filteredDrafts} detailed drafts in results
      </p>
      {filtered.length===0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-white/20">
          <p className="font-semibold text-slate-800 dark:text-white">No matching references</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try a broader term or clear the category and detailed-only filters.</p>
          <button type="button" onClick={reset} className="mt-4 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">Show all references</button>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {grouped.map(group=>(
            <details key={group.category} open={filtersActive||group.items.some(item=>item.authored)}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <summary className="cursor-pointer rounded-sm text-base font-bold text-slate-900 focus-visible:outline-2 focus-visible:outline-cyan-600 dark:text-white">
                {group.category} <span className="ml-2 text-xs font-normal text-slate-500">{group.items.length} subjects</span>
              </summary>
              <ul className="mt-4 grid gap-1 sm:grid-cols-2">
                {group.items.map(item=>(
                  <li key={item.id}>
                    <Link href={`/reference/${item.id}`}
                      className="flex min-w-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-cyan-600 dark:text-slate-100 dark:hover:bg-white/[0.05]">
                      <span className="min-w-0 break-words">{item.title}</span>
                      <span className={`shrink-0 text-[10px] font-semibold ${item.authored?'text-emerald-700 dark:text-emerald-400':'text-slate-500'}`}>
                        {item.authored?'Detailed draft':'Index only'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
