import type { ReactNode } from 'react';
import Link from 'next/link';
import { BookOpenText, Code2, Layers3, LibraryBig } from 'lucide-react';
import { AUTHORED_LESSONS } from '@/lib/academy/authored-content';

import { lessonMap, moduleMap } from '@/lib/academy/curriculum';
import { MDX_METADATA, PUBLISHED_LESSON_IDS } from '@/lib/academy/published';

export function DocShell({ children, active }: { children: ReactNode; active?: string }) {
  const groups = new Map<string, string[]>();
  for (const id of PUBLISHED_LESSON_IDS) {
    const moduleId = lessonMap.get(id)?.moduleId ?? 'other';
    groups.set(moduleId, [...(groups.get(moduleId) ?? []), id]);
  }
  return (
    <div className="h-dvh overflow-y-auto scroll-smooth bg-slate-50 text-slate-900 dark:bg-[#090A0F] dark:text-slate-100">
      <a href="#doc-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-slate-950">
        Skip to article
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#090A0F]/95">
        <nav aria-label="Documentation navigation" className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-extrabold tracking-tight hover:text-cyan-600 dark:hover:text-[#7DEBFF]">
            <BookOpenText aria-hidden="true" size={18} /> Full-Stack Academy
          </Link>
          <div className="ml-auto flex items-center gap-4 text-xs font-semibold sm:text-sm">
            <Link href="/learn" className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-[#7DEBFF]">
              <Layers3 size={15} aria-hidden="true" /> Curriculum
            </Link>
            <Link href="/learn/dashboard" className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-[#7DEBFF]">My progress</Link>
            <Link href="/reference" className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-[#7DEBFF]">
              <LibraryBig size={15} aria-hidden="true" /> Reference
            </Link>
            <Link href="/" className="hidden items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 hover:border-cyan-500 dark:border-white/15 sm:flex">
              <Code2 size={15} aria-hidden="true" /> Interactive workspace
            </Link>
          </div>
        </nav>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[235px_minmax(0,1fr)]">
        <aside aria-label="Published lessons" className="hidden self-start lg:sticky lg:top-20 lg:block">
          <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Available lessons</h2>
            <div className="flex flex-col gap-1">
              {[...groups].map(([moduleId, ids]) => (
                <details key={moduleId} open={active ? ids.includes(active) : moduleId === '00.01'} className="border-b border-slate-200 pb-2 dark:border-white/10">
                  <summary className="cursor-pointer py-2 text-xs font-semibold">{moduleMap.get(moduleId)?.title ?? moduleId} <span className="font-normal text-slate-500">({ids.length})</span></summary>
                  <div className="flex flex-col gap-1">
                    {ids.map(id => <Link key={id} href={`/learn/${id}`} aria-current={active === id ? 'page' : undefined}
                      className={`rounded-lg px-2.5 py-2 text-xs leading-relaxed ${active===id?'bg-cyan-500/10 font-semibold text-cyan-700 dark:text-[#7DEBFF]':'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'}`}>
                      <span className="mr-1 font-mono text-[10px] opacity-60">{id}</span> {MDX_METADATA.get(id)?.title ?? AUTHORED_LESSONS[id].headline}
                    </Link>)}
                  </div>
                </details>
              ))}
            </div>
            <Link href="/learn" className="mt-4 block border-t border-slate-200 pt-3 text-xs font-semibold text-cyan-700 hover:underline dark:border-white/10 dark:text-[#7DEBFF]">
              Browse complete curriculum
            </Link>
          </div>
        </aside>
        <main id="doc-main" className="min-w-0 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DocSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-9 scroll-mt-24 border-t border-slate-200 pt-7 dark:border-white/10">
      <h2 className="mb-4 text-xl font-bold tracking-tight">{title}</h2>
      <div className="space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{children}</div>
    </section>
  );
}

export function CodeBlock({ code, file }: { code: string; file?: string }) {
  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-slate-700 bg-[#0B0D14] text-slate-100">
      {file && <figcaption className="border-b border-white/10 px-4 py-2 font-mono text-xs text-slate-400">{file}</figcaption>}
      <pre className="overflow-x-auto p-4 text-xs leading-6 sm:text-sm"><code>{code}</code></pre>
    </figure>
  );
}

export function DocNotice({ children }: { children: ReactNode }) {
  return <div role="note" className="rounded-xl border border-amber-300/40 bg-amber-100/50 p-4 text-sm leading-7 text-amber-950 dark:border-amber-400/25 dark:bg-amber-400/[0.07] dark:text-amber-100">{children}</div>;
}
