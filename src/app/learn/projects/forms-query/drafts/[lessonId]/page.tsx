import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocNotice, DocShell } from '@/components/course/DocShell';
import { DraftLessonScope } from '@/components/course/DraftLessonScope';
import {
  FORMS_QUERY_DRAFT_IDS,
  FormsQueryDraftArticle,
  isFormsQueryDraftId,
} from '@/content/forms-query-draft-registry';
import { lessonMap, moduleMap } from '@/lib/academy/curriculum';

type Props = { params: Promise<{ lessonId: string }> };
const projectUrl = '/learn/projects/forms-query';
const draftUrl = (id: string) => projectUrl + '/drafts/' + id;

// These previews are intentionally never emitted as published course lessons.
export const dynamicParams = false;

export function generateStaticParams() {
  return FORMS_QUERY_DRAFT_IDS.map(lessonId => ({ lessonId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = isFormsQueryDraftId(lessonId) ? lessonMap.get(lessonId) : undefined;
  return {
    title: lesson ? `${lesson.title} — Draft Preview | Full-Stack Academy` : 'Draft not found | Full-Stack Academy',
    description: lesson
      ? 'Unpublished, guided Forms/Query lesson for review and practice. No course credit or verified lab is awarded.'
      : 'This staged lesson is unavailable.',
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export default async function FormsQueryDraftPage({ params }: Props) {
  const { lessonId } = await params;
  if (!isFormsQueryDraftId(lessonId)) notFound();
  const lesson = lessonMap.get(lessonId);
  if (!lesson) notFound();
  const position = FORMS_QUERY_DRAFT_IDS.indexOf(lessonId);
  const previous = position > 0 ? FORMS_QUERY_DRAFT_IDS[position - 1] : null;
  const next = position < FORMS_QUERY_DRAFT_IDS.length - 1 ? FORMS_QUERY_DRAFT_IDS[position + 1] : null;
  const moduleTitle = moduleMap.get(lesson.moduleId)?.title ?? lesson.module;

  return (
    <DocShell>
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
        <Link href="/learn" className="hover:underline">Curriculum</Link>
        <span aria-hidden="true">/</span>
        <Link href={projectUrl} className="hover:underline">Reliable Task Workflow</Link>
        <span aria-hidden="true">/</span>
        <span>{lessonId} draft preview</span>
      </nav>
      <p className="font-mono text-xs font-semibold uppercase tracking-[.15em] text-cyan-700 dark:text-cyan-300">
        {lessonId} · {moduleTitle} · Unpublished preview
      </p>
      <h1 className="mt-3 max-w-4xl text-2xl font-extrabold tracking-tight sm:text-3xl">{lesson.title}</h1>
      <div className="mt-5">
        <DocNotice>
          <strong>Draft preview, not an accredited or published lesson.</strong>{' '}
          This content is under accessibility and release review. The code samples do not execute in
          this page, completion is not recorded, and the teaching Task API is local-only and
          unauthenticated. To run the real exercises, use the separately installed React workspace.
        </DocNotice>
      </div>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href={projectUrl} className="rounded-lg border border-slate-300 px-3 py-2 font-medium hover:bg-slate-100 dark:border-white/15 dark:hover:bg-white/10">
          Project and local setup
        </Link>
        <a href={`https://github.com/Vaydelux/Full-Stack-Academy/blob/main/drafts/forms-query/lessons/${lessonId}.mdx`}
          target="_blank" rel="noopener noreferrer"
          className="rounded-lg border border-slate-300 px-3 py-2 font-medium hover:bg-slate-100 dark:border-white/15 dark:hover:bg-white/10">
          Inspect MDX source
        </a>
      </div>
      <DraftLessonScope>
        <article aria-label={`Preview article ${lessonId}`}
          className="academy-reading mt-8 max-w-4xl space-y-6 break-words [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-[#0B0D14] [&_pre]:p-4 [&_pre]:text-white [&_code]:break-words [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:font-semibold">
          <FormsQueryDraftArticle lessonId={lessonId} />
        </article>
      </DraftLessonScope>
      <nav aria-label="Draft lesson sequence" className="mt-10 grid gap-3 border-t border-slate-200 pt-7 sm:grid-cols-2 dark:border-white/10">
        {previous ? <Link href={draftUrl(previous)}
          className="rounded-xl border border-slate-200 p-4 text-sm font-semibold hover:border-cyan-500 dark:border-white/15">
          <span className="block text-xs font-normal text-slate-500">Previous draft</span>{lessonMap.get(previous)?.title}
        </Link> : <span />}
        {next ? <Link href={draftUrl(next)}
          className="rounded-xl border border-slate-200 p-4 text-sm font-semibold hover:border-cyan-500 dark:border-white/15 sm:text-right">
          <span className="block text-xs font-normal text-slate-500">Next draft</span>{lessonMap.get(next)?.title}
        </Link> : null}
      </nav>
    </DocShell>
  );
}
