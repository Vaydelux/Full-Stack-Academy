import type { ReactNode } from 'react';
import Link from 'next/link';
import { BookOpenText, Layers3, LibraryBig, Search } from 'lucide-react';
import { DocNavigation } from './DocNavigation';
import { CopyCodeButton } from './CopyCodeButton';
import { lessonMap, referenceCategories, TRACK_GROUPS, trackMap } from '@/lib/academy/curriculum';
import type { CurriculumLesson } from '@/lib/academy/types';
import type { AccessTopic } from '../../../scripts/curriculum-access.mjs';

export function DocShell({ children, active, section = 'learn', activeCategory, catalog = [] }: { children: ReactNode; active?: string; section?: 'learn' | 'reference'; activeCategory?: string; catalog?: readonly AccessTopic<CurriculumLesson>[] }) {
  const current = active ? lessonMap.get(active) : undefined;
  const currentTopics = current ? catalog.filter(item => item.moduleId === current.moduleId) : [];
  const navLink = 'block min-w-0 break-words rounded-lg px-2.5 py-2 text-sm hover:bg-slate-100 focus-visible:outline-2 dark:hover:bg-white/5';
  const activeClass = ' bg-cyan-500/10 font-semibold text-cyan-700 dark:text-cyan-300';
  const navigation = section === 'reference' ? (
    <nav aria-label="Reference categories" className="space-y-1">
      <Link href="/reference" aria-current={activeCategory==='all'?'page':undefined} className={navLink+(activeCategory==='all'?activeClass:'')}>All references</Link>
      {referenceCategories.map(category => <Link key={category} href={'/reference?category='+encodeURIComponent(category)} aria-current={category===activeCategory?'true':undefined} className={navLink+(category===activeCategory?activeClass:'')}>{category}</Link>)}
    </nav>
  ) : (
    <nav aria-label="Curriculum sections" className="space-y-3">
      {current && <div className="border-b border-slate-200 pb-3 dark:border-white/10">
        <Link href={'/learn/track/'+current.trackId} className="block px-2 text-xs font-semibold text-cyan-700 underline dark:text-cyan-300">{current.track}</Link>
        <h3 className="px-2 pt-2 text-sm font-bold">{current.module}</h3>
        <ul className="mt-2 space-y-1">
          {currentTopics.map(item => <li key={item.id}><Link href={'/learn/'+item.id} aria-current={item.id===active?'page':undefined} className={navLink+(item.id===active?activeClass:'')}>
            <span className="block text-xs text-slate-600 dark:text-slate-400">{item.id} · {item.access==='published'?'Published':item.access==='reading'?'Reading':'Planned'}</span>
            {item.title}
          </Link></li>)}
        </ul>
      </div>}
      <Link href="/learn" className={navLink}>All curriculum topics</Link>
      {TRACK_GROUPS.map(group => <details key={group.id} open={current ? group.trackIds.includes(current.trackId) : undefined} className="border-b border-slate-200 pb-2 dark:border-white/10">
        <summary className="cursor-pointer rounded px-2 py-2 text-sm font-semibold">{group.name}</summary>
        <ul className="mt-1 space-y-1">{group.trackIds.map(id=>{const track=trackMap.get(id);return track?<li key={id}><Link href={'/learn/track/'+id} className={navLink+(id===current?.trackId?activeClass:'')}>{track.title}</Link></li>:null;})}</ul>
      </details>)}
    </nav>
  );
  const navigationTitle = section === 'reference' ? 'Reference categories' : 'Curriculum navigation';
  return (
    <div data-doc-shell className="academy-doc-shell h-dvh overflow-y-auto bg-slate-50 text-slate-900 dark:bg-[#090A0F] dark:text-slate-100">
      <a href="#doc-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-slate-950">
        Skip to article
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#090A0F]/95">
        <nav aria-label="Documentation navigation" className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 sm:px-6">
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
            <Link href="/" className="flex min-h-9 items-center font-semibold hover:underline">Workspace</Link>
            <Link href="/search" className="flex min-h-9 items-center gap-1 rounded-lg px-2 hover:underline"><Search size={15} aria-hidden="true" /> Search</Link>
          </div>
        </nav>
      </header>
      <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 lg:gap-8 lg:py-8 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <DocNavigation key={`${section}:${active ?? activeCategory ?? ''}`} title={navigationTitle}>{navigation}</DocNavigation>
        <main id="doc-main" tabIndex={-1} className="academy-doc-main min-w-0 scroll-mt-32 break-words pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DocSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="academy-doc-section mt-9 scroll-mt-32 border-t border-slate-200 pt-7 dark:border-white/10">
      <h2 className="mb-4 text-xl font-bold tracking-tight">{title}</h2>
      <div className="academy-doc-prose space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{children}</div>
    </section>
  );
}

export function CodeBlock({ code, file }: { code: string; file?: string }) {
  return (
    <figure className="my-4 min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-700 bg-[#0B0D14] text-slate-100">
      <figcaption className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2 font-mono text-xs text-slate-300"><span className="min-w-0 break-all">{file ?? 'Code example'}</span><CopyCodeButton code={code} /></figcaption>
      <pre tabIndex={0} aria-label={file ? `Code: ${file}` : "Code example"} className="overflow-x-auto p-4 text-xs leading-6 sm:text-sm"><code>{code}</code></pre>
    </figure>
  );
}

export function DocNotice({ children }: { children: ReactNode }) {
  return <div role="note" className="rounded-xl border border-amber-300/40 bg-amber-100/50 p-4 text-sm leading-7 text-amber-950 dark:border-amber-400/25 dark:bg-amber-400/[0.07] dark:text-amber-100">{children}</div>;
}
