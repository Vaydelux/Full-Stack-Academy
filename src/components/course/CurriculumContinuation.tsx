import Link from 'next/link';
import type { CurriculumLesson } from '@/lib/academy/types';
import type { AccessTopic } from '../../../scripts/curriculum-access.mjs';
import { curriculumNeighbors, curriculumPrerequisites } from '../../../scripts/curriculum-access.mjs';
import { readLessonReferences } from '@/lib/academy/reference-links-server';
import { safeReference } from '../../../scripts/reading-edition.mjs';

const accessLabel = { published: 'Published', reading: 'Reading · lab pending', planned: 'Planned · not available' } as const;

export function CurriculumContext({ lesson, catalog }: { lesson: CurriculumLesson; catalog: readonly AccessTopic<CurriculumLesson>[] }) {
  const prerequisites = curriculumPrerequisites(catalog, lesson.prerequisites, lesson.id);
  const reference = safeReference(lesson.referenceUrl);
  const references = readLessonReferences(lesson.id);
  if (!reference && !prerequisites.length && !references.length) return null;
  return <details className="mt-5 rounded-xl border border-slate-200 p-4 text-sm dark:border-white/10">
    <summary className="cursor-pointer font-semibold">Prerequisites and official documentation</summary>
    {references.length > 0 && <div className="mt-3"><h2 className="font-semibold">Academy reference library</h2><ul className="mt-2 space-y-2">{references.map(item => <li key={item.id}><Link href={'/reference/' + item.id} className="break-words text-cyan-700 underline dark:text-cyan-300">{item.title}</Link> <span className="text-xs text-slate-500">· {item.authored ? 'Authored draft' : 'Index only'}</span></li>)}</ul></div>}
    {prerequisites.length > 0 && <ul className="mt-3 space-y-2">{prerequisites.map(item =>
      <li key={item.id} className="flex flex-wrap items-baseline gap-x-2"><Link href={'/learn/' + item.id} className="break-words font-medium text-cyan-700 underline dark:text-cyan-300">{item.id} · {item.title}</Link><span className="text-xs text-slate-500">{accessLabel[item.access]}</span></li>
    )}</ul>}
    {reference && <a href={reference} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block break-words font-semibold text-cyan-700 underline dark:text-cyan-300">Official documentation for this topic (opens in a new tab)</a>}
    <p className="mt-2 text-xs text-slate-500">These are curriculum references, not a record of completed prerequisites.</p>
  </details>;
}

export function CurriculumContinuation({ lesson, catalog, boundaryOnly = false }: { lesson: CurriculumLesson; catalog: readonly AccessTopic<CurriculumLesson>[]; boundaryOnly?: boolean }) {
  const adjacent = curriculumNeighbors(catalog, lesson.id);
  // Published pages already have within-module published practice navigation.
  // Do not duplicate those links; show reading transitions and new modules only.
  const visible = (item: AccessTopic<CurriculumLesson> | null) =>
    boundaryOnly && item?.access === 'published' && item.moduleId === lesson.moduleId ? null : item;
  const previous = visible(adjacent.previous), next = visible(adjacent.next);
  if (!previous && !next) return null;
  return <nav aria-label="Continue curriculum" className="mt-10 grid min-w-0 gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-white/10">
    {([['Previous topic', previous, 'prev'], ['Next topic', next, 'next']] as const).map(([label, item, direction]) => item && <Link key={direction} rel={direction} href={'/learn/' + item.id} className={'min-w-0 break-words rounded-xl border border-slate-200 p-4 text-sm hover:border-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-white/15 ' + (direction === 'next' ? 'sm:col-start-2' : '')}>
      <span className="block text-xs font-semibold text-slate-500">{label} · {accessLabel[item.access]}</span>
      <span className="mt-1 block font-bold">{item.title}</span>
      {item.moduleId !== lesson.moduleId && <span className="mt-1 block text-xs text-slate-500">Module {item.moduleId} · {item.module}</span>}
    </Link>)}
  </nav>;
}
