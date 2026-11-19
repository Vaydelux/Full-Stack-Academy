import type { Metadata } from 'next';
import Link from 'next/link';
import { PublishedLessonExplorer } from '@/components/course/PublishedLessonExplorer';
import type { DiscoverableLesson } from '@/lib/academy/lesson-discovery';
import { MDX_METADATA, PUBLISHED_LESSON_IDS, LOCAL_LAB_LESSONS } from '@/lib/academy/published';
import { lessonMap, moduleMap, modulesByTrack, summary, trackMap, TRACK_GROUPS } from '@/lib/academy/curriculum';
import { DocShell } from '@/components/course/DocShell';

export const metadata: Metadata = {
  title: 'Learning Paths | Full-Stack Engineering Academy',
  description: 'Explore 28 learning tracks and 111 structured modules covering TypeScript, React, Next.js, NestJS, PostgreSQL, Prisma, Supabase, security and production engineering.',
};

export default function CourseIndex() {
  const publishedCatalog: DiscoverableLesson[] = PUBLISHED_LESSON_IDS.map(id => {
    const lesson = lessonMap.get(id);
    const meta = MDX_METADATA.get(id);
    const moduleId = lesson?.moduleId ?? id.slice(0, 5);
    return {
      id,
      title: meta?.title ?? lesson?.title ?? id,
      moduleId,
      moduleTitle: moduleMap.get(moduleId)?.title ?? moduleId,
      level: meta?.level ?? lesson?.level ?? 'Core',
      minutes: meta?.estimatedMinutes ?? lesson?.estimatedMinutes ?? 0,
      description: meta?.description ?? '',
    };
  });
  const learningModules = [
    { id: '00.01', title: 'Computing & internet foundations', description: 'Understand how applications and the web work.' },
    { id: '00.02', title: 'Developer toolchain', description: 'Prepare a reproducible environment and ship a tested project.' },
    { id: '00.03', title: 'Learning & debugging', description: 'Reproduce, isolate, diagnose, and document problems with evidence.' },
    { id: '01.01', title: 'HTML document structure', description: 'Create semantic, accessible, responsive content pages without a framework.' },
    { id: '01.02', title: 'HTML forms & validation', description: 'Use native controls, browser validation and accessible interactions without a backend.' },
    { id: '01.03', title: 'Accessibility foundations', description: 'Practice keyboard access, focus, naming, readable contrast, alternatives and motion preferences.' },
  ];
  return (
    <DocShell>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-600 dark:text-[#7DEBFF]">Structured hands-on curriculum</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Learn modern full-stack engineering</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        {summary.tracks} tracks, {summary.modules} modules and {summary.plannedLessons} mapped topics. Only published lessons contain verified teaching material; the remaining topics are explicitly marked as planned.
      </p>
      <div className="mt-6 rounded-xl border border-cyan-600/25 bg-cyan-50 p-4 dark:bg-cyan-300/[0.06]">
        <p className="text-sm font-semibold">Returning to learn?</p>
        <p className="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-300">Find your next unfinished lesson, review module progress and export your local notes without searching the entire catalog.</p>
        <Link href="/learn/dashboard" className="mt-3 inline-flex rounded-lg bg-cyan-700 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-800">Open learning dashboard</Link>
      </div>
      <section aria-label="Beginner learning path" className="mt-8">
        <h2 className="mb-3 text-xl font-bold">Start here</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {learningModules.map((module,index) => {
            const lessons = LOCAL_LAB_LESSONS.filter(lesson => lesson.moduleId === module.id);
            return <article key={module.id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">Module {index+1} · {module.id}</p>
              <h3 className="mt-2 text-lg font-bold">{module.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{module.description}</p>
              <p className="mt-3 text-xs text-slate-500">{lessons.length} lessons · {lessons.reduce((minutes, lesson) => minutes+lesson.estimatedMinutes, 0)} min · Local labs</p>
              <Link href={`/learn/${module.id}.01`} className="mt-4 inline-flex rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white">Start module</Link>
            </article>;
          })}
        </div>
      </section>
      <PublishedLessonExplorer catalog={publishedCatalog} />
      <section aria-labelledby="tracks-title" className="mt-10">
        <h2 id="tracks-title" className="mb-4 text-xl font-bold">Tracks and subtopics</h2>
        <div className="space-y-6">
          {TRACK_GROUPS.map((group) => (
            <section key={group.id} className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <h3 className="font-bold">{group.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{group.subjects}</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {group.trackIds.map((id) => {
                  const track = trackMap.get(id);
                  if (!track) return null;
                  return (
                    <li key={id}>
                      <Link href={`/learn/track/${id}`} className="block rounded-lg border border-slate-200 px-3 py-2 transition-colors hover:border-cyan-500 dark:border-white/10">
                        <span className="font-mono text-xs text-cyan-700 dark:text-[#7DEBFF]">{id}</span>
                        <span className="ml-2 text-sm font-semibold">{track.title}</span>
                        <span className="mt-1 block text-xs text-slate-500">{modulesByTrack.get(id)?.length ?? 0} modules</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </DocShell>
  );
}
