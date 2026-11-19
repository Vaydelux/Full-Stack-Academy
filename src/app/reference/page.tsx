import type { Metadata } from 'next';
import { AUTHORED_REFERENCES } from '@/lib/academy/authored-content';
import { references, summary } from '@/lib/academy/curriculum';
import { DocShell } from '@/components/course/DocShell';
import { ReferenceExplorer } from '@/components/course/ReferenceExplorer';

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
        {summary.referenceSubjects} indexed subjects in {referenceCategories.length} categories. Detailed drafts include syntax, inputs, output, examples, mistakes and security notes. Use the search and category filters to distinguish available drafts from index-only subjects.
      </p>
      <ReferenceExplorer entries={references.map(item => ({ id: item.id, category: item.category, title: item.title, slug: item.slug, authored: published.has(item.id) }))} />
    </DocShell>
  );
}
