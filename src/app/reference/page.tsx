import type { Metadata } from 'next';
import Link from 'next/link';
import { AUTHORED_REFERENCES } from '@/lib/academy/authored-content';
import { referenceCategories, references, summary } from '@/lib/academy/curriculum';
import { DocShell } from '@/components/course/DocShell';

export const metadata: Metadata = {
  title: 'Developer Reference Library | Full-Stack Engineering Academy',
  description: 'Syntax, parameters, return values, runnable examples, common mistakes and official sources for a modern TypeScript full-stack architecture.',
};

const published = new Set(AUTHORED_REFERENCES.map((r) => r.id));

export default function ReferenceIndex() {
  return (
    <DocShell>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-[#7DEBFF]">Searchable technology reference</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">API and library references</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        {summary.referenceSubjects} indexed subjects in {referenceCategories.length} categories. Reference drafts include syntax, inputs, output, examples, mistakes and security notes. Unwritten entries are marked as indexed rather than published.
      </p>
      <div className="mt-8 space-y-6">
        {referenceCategories.map((category) => {
          const entries = references.filter((r) => r.category === category);
          return (
            <details key={category} open={entries.some((r) => published.has(r.id))} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <summary className="cursor-pointer text-lg font-bold">{category} <span className="ml-2 font-mono text-xs font-normal text-slate-500">{entries.length} entries</span></summary>
              <ul className="mt-4 grid gap-1 sm:grid-cols-2">
                {entries.map((item) => (
                  <li key={item.id}>
                    <Link href={`/reference/${item.id}`} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/[0.05]">
                      <span className="min-w-0 break-words">{item.title}</span>
                      <span className={`shrink-0 text-[10px] font-semibold ${published.has(item.id) ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}`}>
                        {published.has(item.id) ? 'Published' : 'Indexed'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </DocShell>
  );
}
