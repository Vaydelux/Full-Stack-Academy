import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AUTHORED_LESSONS } from '@/lib/academy/authored-content';
import { lessonsByModule, lessonMap, moduleMap } from '@/lib/academy/curriculum';
import { CodeBlock, DocNotice, DocSection, DocShell } from '@/components/course/DocShell';
import { lessonNeighbors } from '@/lib/academy/lesson-neighbors.mjs';
import { getPublicOrigin } from '@/lib/academy/site';
import { LessonArticle } from '@/content/lesson-registry';
import { MDX_METADATA, PUBLISHED_LESSON_IDS, lessonRubric } from '@/lib/academy/published';
import { LocalLessonCompletion } from '@/components/course/LocalLessonCompletion';
import { LessonNotebook } from '@/components/course/LessonNotebook';
import { readCourseProgress, readReadingIds, readReadingLesson, readCurriculumAccess } from '@/lib/academy/course-progress-server';
import { CurriculumContext, CurriculumContinuation } from '@/components/course/CurriculumContinuation';
import { ReadingEditionArticle } from '@/components/course/ReadingEditionArticle';
import { readingModuleNavigation } from '../../../../scripts/reading-navigation.mjs';

type LessonPageProps = { params: Promise<{ lessonId: string }> };

export function generateStaticParams() {
  return [...PUBLISHED_LESSON_IDS, ...readReadingIds()].map((lessonId) => ({ lessonId }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = lessonMap.get(lessonId);
  const authored = AUTHORED_LESSONS[lessonId];
  const mdxMeta = MDX_METADATA.get(lessonId);
  if (!lesson) return { title: 'Lesson not found', robots: { index: false } };
  if (!authored && !mdxMeta && readReadingLesson(lessonId)) return { title: lesson.title + ' — Reading Edition | Full-Stack Engineering Academy', description: 'Read the authored manuscript; editorial and lab qualification remain pending. No course credit.', robots: { index: false, follow: true } };
  return {
    title: `${mdxMeta?.title ?? authored?.headline ?? lesson.title} | Full-Stack Engineering Academy`,
    description: mdxMeta?.description ?? authored?.subtitle ?? `Planned lesson: ${lesson.title}. This topic has not yet been authored or reviewed.`,
    robots: { index: Boolean(authored || mdxMeta), follow: true },
    alternates: (authored || mdxMeta) && getPublicOrigin() ? { canonical: `/learn/${lessonId}` } : undefined,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = lessonMap.get(lessonId);
  if (!lesson) notFound();
  const authored = AUTHORED_LESSONS[lessonId];
  const mdxMeta = MDX_METADATA.get(lessonId);
  const localRubric = mdxMeta ? lessonRubric(lessonId) : undefined;
  const neighbors = lessonNeighbors(lessonsByModule.get(lesson.moduleId) ?? [], PUBLISHED_LESSON_IDS, lessonId);
  const reading = !authored && !mdxMeta ? readReadingLesson(lessonId) : undefined;
  const accessCatalog = readCurriculumAccess();
  if (reading) {
    const readingIds = readReadingIds();
    const moduleNavigation = readingModuleNavigation(lessonsByModule.get(lesson.moduleId) ?? [], PUBLISHED_LESSON_IDS, readingIds, lessonId);
    const sourceUrl = 'https://github.com/Vaydelux/Full-Stack-Academy/blob/main/drafts/' + reading.group + '/lessons/' + reading.id + '.mdx';
    return <DocShell active={lessonId} catalog={accessCatalog}>
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-slate-500"><Link href="/learn">Curriculum</Link> / <Link href={'/learn/track/' + lesson.trackId}>{lesson.track}</Link> / Reading edition</nav>
      <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">{lesson.id} · {lesson.level} · Reading edition</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{lesson.title}</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Editorial review pending · Lab not certified · No completion credit</p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-cyan-700 dark:text-cyan-300"><Link href="/learn/reading" className="underline underline-offset-2">Browse reading editions</Link><a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Inspect original manuscript</a></div>
      {moduleNavigation.length > 0 && <details className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <summary className="cursor-pointer text-sm font-semibold">{moduleMap.get(lesson.moduleId)?.title ?? lesson.module} · {moduleNavigation.length} readable topics</summary>
        <nav aria-label="Reading module lessons" className="mt-3"><ol className="space-y-1">
          {moduleNavigation.map(item => <li key={item.id}><Link href={'/learn/' + item.id} aria-current={item.active ? 'page' : undefined} className={'flex flex-wrap items-baseline gap-x-2 rounded-lg px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/5 ' + (item.active ? 'font-bold text-cyan-700 dark:text-cyan-300' : '')}><span className="font-mono text-xs">{item.id}</span><span className="min-w-0 flex-1">{item.title}</span><span className="text-xs text-slate-500">{item.edition === 'published' ? 'Published' : 'Reading'}</span></Link></li>)}
        </ol></nav>
      </details>}
      <CurriculumContext lesson={lesson} catalog={accessCatalog} manuscriptPrerequisites={reading.prerequisites} />
      <ReadingEditionArticle source={reading.source} title={lesson.title} />
      <CurriculumContinuation lesson={lesson} catalog={accessCatalog} />
    </DocShell>;
  }
  const staged = !authored && !mdxMeta && readCourseProgress().draftIds.includes(lessonId);
  return (
    <DocShell active={lessonId} catalog={accessCatalog}>
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-slate-500">
        <Link href="/learn" className="hover:underline">Curriculum</Link>
        {' / '}
        <Link href={`/learn/track/${lesson.trackId}`} className="hover:underline">{lesson.track}</Link>
        {' / '}{lesson.module}
      </nav>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-[#7DEBFF]">{lesson.id} · {lesson.level}</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{mdxMeta?.title ?? authored?.headline ?? lesson.title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{mdxMeta?.description ?? authored?.subtitle ?? moduleMap.get(lesson.moduleId)?.outcome}</p>
      {(authored || mdxMeta) && <CurriculumContext lesson={lesson} catalog={accessCatalog} />}
      {(authored || mdxMeta) && <LessonNotebook key={lessonId} lessonId={lessonId} />}
      {!authored && !mdxMeta ? (
        <div className="mt-7 space-y-5">
          <DocNotice><strong>{staged ? 'Authored draft — not published.' : 'Planned lesson — not published.'}</strong> {staged
            ? 'The tutorial and its practice sources have been written, but their full runtime, editorial and accessibility qualification is still pending. This lesson is not yet available or completable.'
            : 'This topic is part of the planned curriculum and does not yet have a reviewed tutorial or runnable release-qualified lab.'}</DocNotice>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{staged
            ? 'The manuscript is tracked in the course development roadmap. Until release checks pass, use the official documentation below and choose an available lesson from the published curriculum.'
            : 'For now, use the module context and the official documentation. This topic will be updated once its examples, exercises and editorial checks are complete.'}</p>
          <a href={lesson.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-cyan-700 hover:underline dark:text-[#7DEBFF]">Read official documentation</a>
        </div>
      ) : mdxMeta ? (
        <div className="mt-6">
          <p className="mb-5 text-xs text-slate-500">
            {Object.entries(mdxMeta.stack).map(([tech,version])=>`${tech} ${version}`).join(' · ')} · {mdxMeta.reviewedAt === null ? 'Automated-qualified · Human review pending' : `Last reviewed ${mdxMeta.reviewedAt}`} · ~{mdxMeta.estimatedMinutes} min
          </p>
          {mdxMeta.reviewedAt === null && <div className="mb-5"><DocNotice><strong>Automated-qualified release.</strong> Instructor runtime, build and browser checks passed for this release candidate. Independent human editorial and accessibility review, including screen-reader review, is pending. Course completion is self-assessed, not a certification.</DocNotice></div>}
          <article aria-label="Guided lesson" className="max-w-none">
            <LessonArticle lessonId={lessonId} />
            {localRubric && <LocalLessonCompletion lessonId={lessonId} rubric={localRubric} /> }
          </article>
        </div>
      ) : authored ? (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">Authored sample · ~{authored.estMinutes} min</span>
            <Link href={`/?lesson=${encodeURIComponent(lessonId)}&mode=practice`} className="rounded-lg bg-cyan-700 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-600 dark:bg-[#00F0FF] dark:text-[#090A0F]">
              Open interactive lab
            </Link>
          </div>
          <DocSection id="problem" title="The problem we are solving"><p>{authored.problem}</p></DocSection>
          <DocSection id="objectives" title="What you will learn">
            <ul className="list-disc space-y-1 pl-6">{authored.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
          </DocSection>
          <DocSection id="mental-model" title="Build the mental model">
            <p>{authored.mentalSummary}</p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {authored.mentalFlow.map((step, idx) => (
                <li key={idx} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
                  <span className="text-xs font-mono text-cyan-700 dark:text-[#7DEBFF]">Step {idx + 1}</span>
                  <h3 className="font-bold">{step.label}</h3><p className="text-xs">{step.caption}</p>
                </li>
              ))}
            </ol>
          </DocSection>
          <DocSection id="predict" title="Predict before you run">
            <p>{authored.predictFirst.prompt}</p>
            <details className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
              <summary className="cursor-pointer font-semibold">Reveal and explain the answer</summary>
              <p className="mt-3">{authored.predictFirst.answer}</p>
            </details>
          </DocSection>
          <DocSection id="steps" title="Guided implementation: step by step">
            <p>Each step specifies a real file, an action and an expected outcome. Open the interactive lab to execute browser-supported code; server and database examples require their corresponding local environments.</p>
            {authored.steps.map((step, index) => (
              <article key={step.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <h3 className="font-bold">{index + 1}. {step.title}</h3>
                <p className="mt-2">{step.copy}</p>
                <CodeBlock code={step.code} file={step.file} />
                <p className="text-xs"><strong>Expected result:</strong> {step.expected}</p>
              </article>
            ))}
          </DocSection>
          <DocSection id="quiz" title="Knowledge check">
            <p className="font-semibold">{authored.quiz.question}</p>
            <ol type="A" className="list-[upper-alpha] space-y-1 pl-6">
              {authored.quiz.choices.map((option) => <li key={option}>{option}</li>)}
            </ol>
            <details className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
              <summary className="cursor-pointer font-semibold">Reveal the correct answer and explanation</summary>
              <p className="mt-3"><strong>Correct option:</strong> {String.fromCharCode(65 + authored.quiz.answer)}. {authored.quiz.explanation}</p>
              <p className="mt-2"><strong>Misconception:</strong> {authored.quiz.misconception.claim}</p>
              <p className="mt-1">{authored.quiz.misconception.correction}</p>
            </details>
          </DocSection>
          <DocSection id="challenge" title={`Hands-on challenge: ${authored.challenge.title}`}>
            <p>{authored.challenge.description}</p>
            <CodeBlock code={authored.challenge.starterCode} file="challenge-starter.tsx" />
            <p className="font-semibold">Completion rubric</p>
            <ul className="list-disc space-y-1 pl-6">
              {authored.challenge.rubric.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <details className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
              <summary className="cursor-pointer font-semibold">Show hint</summary><p className="mt-3">{authored.challenge.hint}</p>
            </details>
            <details className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
              <summary className="cursor-pointer font-semibold">Show worked solution</summary>
              <CodeBlock code={authored.challenge.solution} />
            </details>
            <p className="text-xs">This article does not automatically grade code. Use the interactive workspace for the current self-assessed lesson completion gate.</p>
          </DocSection>
          <DocSection id="bug-hunt" title={`Bug hunt: ${authored.bugHunt.title}`}>
            <p><strong>Symptom:</strong> {authored.bugHunt.symptom}</p>
            <CodeBlock code={authored.bugHunt.buggyCode} file="buggy-example.ts" />
            <details className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
              <summary className="cursor-pointer font-semibold">Show diagnosis and repair</summary>
              <p className="mt-3">{authored.bugHunt.diagnosis}</p><p>{authored.bugHunt.fixNote}</p>
            </details>
          </DocSection>
          <DocSection id="reflect" title="Reflect and review"><p>{authored.reflection}</p></DocSection>
          <DocSection id="resources" title="Related references and official documentation">
            <ul className="list-disc space-y-2 pl-6">
              {authored.relatedReferenceIds.map((id) => (
                <li key={id}><Link href={`/reference/${id}`} className="text-cyan-700 hover:underline dark:text-[#7DEBFF]">Reference: {id}</Link></li>
              ))}
              {authored.sources.map((source) => (
                <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:underline dark:text-[#7DEBFF]">{source.label} (official)</a></li>
              ))}
            </ul>
          </DocSection>
          <div className="mt-8">
            <Link href={`/?lesson=${encodeURIComponent(lessonId)}&mode=practice`} className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-600 dark:bg-[#00F0FF] dark:text-[#090A0F]">Practice in the interactive workspace</Link>
          </div>
        </>
      ) : null}
      {(authored || mdxMeta) && (neighbors.previous || neighbors.next) && (
        <nav aria-label="Adjacent published lessons" className="mt-10 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-white/10">
          {neighbors.previous && <Link rel="prev" href={`/learn/${neighbors.previous.id}`} className="min-w-0 break-words rounded-xl border border-slate-200 p-4 hover:border-cyan-500 dark:border-white/15">
            <span className="block text-xs font-semibold text-cyan-700 dark:text-cyan-300">Previous available lesson</span>
            <span className="mt-2 block text-sm font-bold">{neighbors.previous.title}</span>
          </Link>}
          {neighbors.next && <Link rel="next" href={`/learn/${neighbors.next.id}`} className="min-w-0 break-words rounded-xl border border-slate-200 p-4 hover:border-cyan-500 sm:col-start-2 dark:border-white/15">
            <span className="block text-xs font-semibold text-cyan-700 dark:text-cyan-300">Next available lesson</span>
            <span className="mt-2 block text-sm font-bold">{neighbors.next.title}</span>
          </Link>}
        </nav>
      )}
      {(authored || mdxMeta) && <CurriculumContinuation lesson={lesson} catalog={accessCatalog} boundaryOnly />}
    </DocShell>
  );
}
