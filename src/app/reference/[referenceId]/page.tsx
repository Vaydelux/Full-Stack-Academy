import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AUTHORED_REFERENCES } from '@/lib/academy/authored-content';
import { referenceMap } from '@/lib/academy/curriculum';
import { CodeBlock, DocNotice, DocSection, DocShell } from '@/components/course/DocShell';
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
    robots: { index: Boolean(authored) && authored.status !== 'Unverified draft', follow: true },
    alternates: authored && authored.status !== 'Unverified draft' && getPublicOrigin() ? { canonical: `/reference/${referenceId}` } : undefined,
  };
}

export default async function ReferencePage({ params }: ReferencePageProps) {
  const { referenceId } = await params;
  const entry = referenceMap.get(referenceId);
  if (!entry) notFound();
  const authored = referenceById.get(referenceId);
  return (
    <DocShell>
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-slate-500">
        <Link href="/reference" className="hover:underline">Reference library</Link> / {entry.category}
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
          <DocSection id="related" title="Related lessons and official source">
            <ul className="list-disc space-y-2 pl-6">
              {authored.relatedLessonIds.map((id) => <li key={id}><Link href={`/learn/${id}`} className="text-cyan-700 hover:underline dark:text-[#7DEBFF]">Lesson {id}</Link></li>)}
              <li><a href={authored.canonicalUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:underline dark:text-[#7DEBFF]">Official versioned documentation</a></li>
            </ul>
          </DocSection>
        </>
      )}
    </DocShell>
  );
}
