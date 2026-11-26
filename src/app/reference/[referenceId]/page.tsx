import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AUTHORED_REFERENCES } from '@/lib/academy/authored-content';
import { referenceMap } from '@/lib/academy/curriculum';
import { CodeBlock, DocNotice, DocSection, DocShell } from '@/components/course/DocShell';
import { readReferenceLessons } from '@/lib/academy/reference-links-server';
import { safeReference } from '../../../../scripts/reading-edition.mjs';
import { getPublicOrigin } from '@/lib/academy/site';

type ReferencePageProps = { params: Promise<{ referenceId: string }> };
const referenceById = new Map(AUTHORED_REFERENCES.map((ref) => [ref.id, ref]));

export function generateStaticParams() {
  return AUTHORED_REFERENCES.map((ref) => ({ referenceId: ref.id }));
}

export async function generateMetadata({ params }: ReferencePageProps): Promise<Metadata> {
  const { referenceId } = await params;
  const entry = referenceMap.get(referenceId);
  const authored = referenceById.get(referenceId);
  if (!entry) return { title: 'Reference not found', robots: { index: false } };
  return {
    title: `${authored?.heading ?? entry.title} | Developer Reference`,
    description: authored?.summary ?? `Indexed reference for ${entry.title}. Detailed documentation is not yet published.`,
    robots: { index: Boolean(authored), follow: true },
    alternates: authored && getPublicOrigin() ? { canonical: `/reference/${referenceId}` } : undefined,
  };
}

export default async function ReferencePage({ params }: ReferencePageProps) {
  const { referenceId } = await params;
  const entry = referenceMap.get(referenceId);
  if (!entry) notFound();
  const authored = referenceById.get(referenceId);
  const related = readReferenceLessons(referenceId);
  const official = authored ? safeReference(authored.canonicalUrl) : null;
  return (
    <DocShell section="reference" activeCategory={entry.category}>
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-slate-500">
        <Link href="/reference" className="hover:underline">Reference library</Link> / <Link href={`/reference?category=${encodeURIComponent(entry.category)}`} className="hover:underline">{entry.category}</Link>
      </nav>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-[#7DEBFF]">{entry.category}</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{authored?.heading ?? entry.title}</h1>
      {!authored ? (
        <div className="mt-7 space-y-5">
          <DocNotice><strong>Indexed reference — not published yet.</strong> This entry is a topic placeholder, not a completed API reference. Syntax, examples, and version-specific behavior have not been reviewed.</DocNotice>
          <Link href="/reference" className="inline-block text-sm font-semibold text-cyan-700 hover:underline dark:text-[#7DEBFF]">Return to the reference index</Link>
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{authored.summary}</p>
          <p className="mt-2 text-xs text-slate-500">{authored.majorVersion} · {authored.status}</p>
          <DocNotice>Authored draft. Examples are illustrative and may require local setup; this page is not a runtime qualification receipt.</DocNotice>
          <details className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-white/10">
            <summary className="cursor-pointer text-sm font-semibold">On this page</summary><nav aria-label="On this page" className="mt-3">
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {([['syntax','Syntax'],['parameters','Parameters'],['returns','Return value'],['minimal','Minimal example'],['production','Production example'],['mistakes','Common mistakes'],['security','Security and performance'],['related','Related lessons']] as const).map(([id,label]) => <li key={id}><a href={`#${id}`} className="text-cyan-700 hover:underline dark:text-cyan-300">{label}</a></li>)}
            </ul>
          </nav></details>
          <DocSection id="syntax" title="Syntax"><CodeBlock code={authored.syntax} /></DocSection>
          <DocSection id="parameters" title="Parameters"><p>{authored.parameters}</p></DocSection>
          <DocSection id="returns" title="Return value"><p>{authored.returns}</p></DocSection>
          <DocSection id="minimal" title="Minimal example"><CodeBlock code={authored.minimalExample} file={`example.${authored.lang}`} /></DocSection>
          <DocSection id="production" title="Production example"><CodeBlock code={authored.productionExample} file={`production.${authored.lang}`} /></DocSection>
          <DocSection id="mistakes" title="Common mistakes">
            <ul className="list-disc space-y-2 pl-6">{authored.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
          </DocSection>
          <DocSection id="security" title="Security and performance notes">
            <ul className="list-disc space-y-2 pl-6">{authored.securityPerformanceNotes.map((item) => <li key={item}>{item}</li>)}</ul>
          </DocSection>
        </>
      )}
      <DocSection id="related" title="Related lessons and official source">
        {related.length ? <ul className="space-y-2">{related.map(item => <li key={item.id} className="flex flex-wrap items-baseline gap-x-2">
          <Link href={'/learn/' + item.id} className="break-words text-cyan-700 underline dark:text-cyan-300">{item.title}</Link>
          <span className="text-xs text-slate-500">{item.id} · {item.access === 'published' ? 'Published' : item.access === 'reading' ? 'Reading · lab pending' : 'Planned'}</span>
        </li>)}</ul> : <p>No explicit lesson cross-reference has been authored yet.</p>}
        {official && <a href={official} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-cyan-700 underline dark:text-cyan-300">Official documentation (opens in a new tab)</a>}
      </DocSection>
    </DocShell>
  );
}
