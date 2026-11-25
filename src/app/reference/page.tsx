import type { Metadata } from 'next';
import { AUTHORED_REFERENCES } from '@/lib/academy/authored-content';
import { referenceCategories, references, summary } from '@/lib/academy/curriculum';
import { DocShell } from '@/components/course/DocShell';
import { ReferenceExplorer } from '@/components/course/ReferenceExplorer';

export const metadata: Metadata = {
  title: 'Developer Reference Library | Full-Stack Engineering Academy',
  description: 'Search by API, hook, syntax or category; read version-aware authored drafts and distinguish them from indexed subjects.',
};

export default async function ReferenceIndex({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const raw = (await searchParams).category;
  const initialCategory = typeof raw === 'string' && referenceCategories.includes(raw) ? raw : 'all';
  return (
    <DocShell section="reference">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-[#7DEBFF]">Modern reference encyclopedia</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">API and library references</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        Explore {summary.referenceSubjects} indexed technical subjects across {referenceCategories.length} categories.
        {AUTHORED_REFERENCES.length} have authored draft pages with syntax, examples, mistakes and links to official documentation.
        Indexed-only entries remain visibly unimplemented. Start with a search or narrow the category.
      </p>
      <ReferenceExplorer
        key={initialCategory}
        initialCategory={initialCategory}
        entries={references}
        categories={referenceCategories}
        authoredIds={AUTHORED_REFERENCES.map((entry) => entry.id)}
      />
    </DocShell>
  );
}
