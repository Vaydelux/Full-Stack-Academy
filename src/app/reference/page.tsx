import type { Metadata } from 'next';
import { AUTHORED_REFERENCES } from '@/lib/academy/authored-content';
import { referenceCategories, references, summary } from '@/lib/academy/curriculum';
import { DocShell } from '@/components/course/DocShell';
import Link from 'next/link';
import { referenceCoverage } from '../../../scripts/reference-quality.mjs';
import { ReferenceExplorer } from '@/components/course/ReferenceExplorer';

export const metadata: Metadata = {
  title: 'Developer Reference Library | Full-Stack Engineering Academy',
  description: 'Search by API, hook, syntax or category; read version-aware authored drafts and distinguish them from indexed subjects.',
};

export default async function ReferenceIndex({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const raw = (await searchParams).category;
  const initialCategory = typeof raw === 'string' && referenceCategories.includes(raw) ? raw : 'all';
  const authoredById = new Map(AUTHORED_REFERENCES.map(entry => [entry.id, entry]));
  const searchable = references.map(entry => { const draft = authoredById.get(entry.id); return { ...entry, summary: draft?.summary, version: draft?.majorVersion, heading: draft?.heading }; });
  const coverage = referenceCoverage(references, AUTHORED_REFERENCES.map(entry => entry.id));
  return (
    <DocShell section="reference" activeCategory={initialCategory}>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-[#7DEBFF]">Modern reference encyclopedia</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">API and library references</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        Explore {summary.referenceSubjects} indexed technical subjects across {referenceCategories.length} categories.
        {' '}{AUTHORED_REFERENCES.length} have authored draft pages with syntax, examples, mistakes and links to official documentation.
        Authored drafts are distinct from runtime-qualified examples. Search by API name, version or summary, or narrow the category.
      </p>
      <details className="mt-5 rounded-xl border border-slate-200 p-4 text-sm dark:border-white/10">
        <summary className="cursor-pointer font-semibold">Reference coverage by technology</summary>
        <p className="mt-2 text-xs text-slate-500">Authored drafts are not runtime-certified. Choose a category to explore its entries.</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">{coverage.map(row => <li key={row.category} className="min-w-0">
          <Link href={'/reference?category=' + encodeURIComponent(row.category)} className="flex flex-wrap justify-between gap-x-2 rounded-lg px-2 py-2 text-cyan-700 hover:underline focus-visible:outline-2 dark:text-cyan-300">
            <span className="break-words">{row.category}</span><span className="text-xs text-slate-500">{row.authored}/{row.indexed} authored</span>
          </Link>
          <progress aria-label={row.category + ' authored references'} value={row.authored} max={row.indexed} className="h-1 w-full" />
        </li>)}</ul>
      </details>
      <ReferenceExplorer
        key={initialCategory}
        initialCategory={initialCategory}
        entries={searchable}
        categories={referenceCategories}
        authoredIds={AUTHORED_REFERENCES.map((entry) => entry.id)}
      />
    </DocShell>
  );
}
