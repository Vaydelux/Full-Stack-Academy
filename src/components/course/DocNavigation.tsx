'use client';

import { useId, useState, type ReactNode } from 'react';

export function DocNavigation({ title, children }: { title: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <aside aria-label={title} className="min-w-0 self-start lg:sticky lg:top-20">
      <div className="rounded-xl border border-slate-200 bg-white p-3 lg:p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <button type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}
          className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-sm font-bold lg:hidden">
          {title}<span aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
        <h2 className="mb-3 hidden text-xs font-bold uppercase tracking-widest text-slate-500 lg:block dark:text-slate-400">{title}</h2>
        <div id={id} className={`${expanded ? 'block' : 'hidden'} max-h-[40dvh] overflow-y-auto overscroll-contain lg:block lg:max-h-[calc(100dvh-11rem)]`}>
          {children}
        </div>
      </div>
    </aside>
  );
}
