import type { ReactNode } from 'react';
import Link from 'next/link';
import { BookOpenText, Code2, Layers3, LibraryBig } from 'lucide-react';
import { CopyCodeButton } from './CopyCodeButton';
import { AUTHORED_LESSONS } from '@/lib/academy/authored-content';

import { lessonMap, moduleMap, referenceCategories } from '@/lib/academy/curriculum';
import { MDX_METADATA, PUBLISHED_LESSON_IDS } from '@/lib/academy/published';

export function DocShell({ children, active, section = 'learn' }: { children: ReactNode; active?: string; section?: 'learn' | 'reference' }) {
  const groups = new Map<string, string[]>();
  for (const id of PUBLISHED_LESSON_IDS) {
    const moduleId = lessonMap.get(id)?.moduleId ?? 'other';
    groups.set(moduleId, [...(groups.get(moduleId) ?? []), id]);
  }
  const lessonNavigation = (
    <div className="flex flex-col gap-1">
      {[...groups].map(([moduleId, ids]) => (
        <details key={moduleId} open={active ? ids.includes(active) : moduleId === '00.01'} className="border-b border-slate-200 pb-2 dark:border-white/10">
          <summary className="cursor-pointer py-2 text-sm font-semibold">{moduleMap.get(moduleId)?.title ?? moduleId} <span className="font-normal text-slate-500">({ids.length})</span></summary>
          <div className="flex flex-col gap-1">
            {ids.map(id => <Link key={id} href={`/learn/${id}`} aria-current={active === id ? 'page' : undefined}
              className={`min-w-0 break-words rounded-lg px-2.5 py-2 text-sm leading-relaxed ${active===id?'bg-cyan-500/10 font-semibold text-cyan-700 dark:text-[#7DEBFF]':'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'}`}>
              <span className="mr-1 font-mono text-xs opacity-70">{id}</span> {MDX_METADATA.get(id)?.title ?? AUTHORED_LESSONS[id]?.headline ?? lessonMap.get(id)?.title ?? id}
            </Link>)}
          </div>
        </details>
      ))}
      <Link href="/learn" className="mt-3 text-sm font-semibold text-cyan-700 hover:underline dark:text-[#7DEBFF]">Browse complete curriculum</Link>
    </div>
  );
  const navigation = section === 'reference' ? (
    <div className="flex flex-col gap-1">
      <Link href="/reference" className="rounded-lg px-2 py-2 text-sm font-semibold hover:underline">All references</Link>
      {referenceCategories.map(category => <Link key={category} href={`/reference?category=${encodeURIComponent(category)}`} className="rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">{category}</Link>)}
    </div>
  ) : lessonNavigation;
  const navigationTitle = section === 'reference' ? 'Reference categories' : 'Available lessons';
  return (
    <div data-doc-shell className="h-dvh overflow-y-auto motion-safe:scroll-smooth bg-slate-50 text-slate-900 dark:bg-[#090A0F] dark:text-slate-100">
      <a href="#doc-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-slate-950">
        Skip to article
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#090A0F]/95">
        <nav aria-label="Documentation navigation" className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-extrabold tracking-tight hover:text-cyan-600 dark:hover:text-[#7DEBFF]">
            <BookOpenText aria-hidden="true" size={18} /> Full-Stack Academy
          </Link>
          <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold sm:ml-auto sm:w-auto sm:text-sm">
            <Link href="/learn" className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-[#7DEBFF]">
              <Layers3 size={15} aria-hidden="true" /> Curriculum
            </Link>
            <Link href="/learn/dashboard" className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-[#7DEBFF]">My progress</Link>
            <Link href="/learn/projects" className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-[#7DEBFF]">Projects</Link>
            <Link href="/reference" className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-[#7DEBFF]">
              <LibraryBig size={15} aria-hidden="true" /> Reference
            </Link>
            <Link href="/" className="hidden items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 hover:border-cyan-500 dark:border-white/15 sm:flex">
              <Code2 size={15} aria-hidden="true" /> Interactive workspace
            </Link>
          </div>
        </nav>
      </header>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:gap-8 lg:py-8 sm:px-6 lg:grid-cols-[235px_minmax(0,1fr)]">
        <aside aria-label={navigationTitle} className="min-w-0 self-start lg:sticky lg:top-24">
          <details key={`${section}:${active ?? ''}`} className="rounded-xl border border-slate-200 bg-white p-3 lg:hidden dark:border-white/10 dark:bg-white/[0.03]">
            <summary className="cursor-pointer py-2 text-sm font-bold">{navigationTitle}</summary>
            <div className="mt-2 max-h-[45dvh] overflow-y-auto overscroll-contain">{navigation}</div>
          </details>
          <div className="hidden max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-4 lg:block dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{navigationTitle}</h2>
            {navigation}
          </div>
        </aside>
        <main id="doc-main" tabIndex={-1} className="min-w-0 scroll-mt-32 break-words pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DocSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-9 scroll-mt-32 border-t border-slate-200 pt-7 dark:border-white/10">
      <h2 className="mb-4 text-xl font-bold tracking-tight">{title}</h2>
      <div className="space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{children}</div>
    </section>
  );
}

export function CodeBlock({ code, file }: { code: string; file?: string }) {
  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-slate-700 bg-[#0B0D14] text-slate-100">
      <figcaption className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2 font-mono text-xs text-slate-300"><span className="min-w-0 break-all">{file ?? 'Code example'}</span><CopyCodeButton code={code} /></figcaption>
      <pre tabIndex={0} aria-label={file ? `Code: ${file}` : "Code example"} className="overflow-x-auto p-4 text-xs leading-6 sm:text-sm"><code>{code}</code></pre>
    </figure>
  );
}

export function DocNotice({ children }: { children: ReactNode }) {
  return <div role="note" className="rounded-xl border border-amber-300/40 bg-amber-100/50 p-4 text-sm leading-7 text-amber-950 dark:border-amber-400/25 dark:bg-amber-400/[0.07] dark:text-amber-100">{children}</div>;
}
