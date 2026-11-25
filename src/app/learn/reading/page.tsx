import type { Metadata } from 'next';
import Link from 'next/link';
import { DocShell, DocNotice } from '@/components/course/DocShell';
import { PublishedLessonExplorer } from '@/components/course/PublishedLessonExplorer';
import type { DiscoverableLesson } from '@/lib/academy/lesson-discovery';
import { lessonMap, moduleMap } from '@/lib/academy/curriculum';
import { readReadingIds } from '@/lib/academy/course-progress-server';

export const metadata: Metadata = {
  title: 'Reading Editions | Full-Stack Engineering Academy',
  description: 'Read authored curriculum manuscripts with explicit review and lab qualification boundaries.',
  robots: { index: false, follow: true },
};
export default function ReadingLibraryPage() {
  const catalog: DiscoverableLesson[] = readReadingIds().map(id => {
    const lesson = lessonMap.get(id);
    if (!lesson) throw Error('Noncanonical reading edition: ' + id);
    return { id, title: lesson.title, moduleId: lesson.moduleId, moduleTitle: moduleMap.get(lesson.moduleId)?.title ?? lesson.module, level: lesson.level, minutes: lesson.estimatedMinutes, description: moduleMap.get(lesson.moduleId)?.outcome ?? '' };
  });
  return <DocShell>
    <nav aria-label="Breadcrumb" className="mb-5 text-xs text-slate-500"><Link href="/learn">Curriculum</Link> / Reading editions</nav>
    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Reading editions</h1>
    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{catalog.length} authored manuscripts for reading and independent study.</p>
    <div className="mt-5"><DocNotice>These articles retain their original draft boundaries. Editorial review, executable lab qualification and course completion are separate. Examples are not executed by this website.</DocNotice></div>
    <PublishedLessonExplorer catalog={catalog} edition="reading" />
    <Link href="/learn" className="mt-7 inline-flex font-semibold text-sm text-cyan-700 underline dark:text-cyan-300">Return to published curriculum</Link>
  </DocShell>;
}
