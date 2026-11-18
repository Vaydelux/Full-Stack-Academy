import type { Metadata } from 'next';
import Link from 'next/link';
import { AUTHORED_LESSONS } from '@/lib/academy/authored-content';
import { MDX_METADATA, PUBLISHED_LESSON_IDS } from '@/lib/academy/published';
import { modulesByTrack, summary, trackMap, TRACK_GROUPS } from '@/lib/academy/curriculum';
import { DocShell } from '@/components/course/DocShell';

export const metadata: Metadata = {
  title: 'Learning Paths | Full-Stack Engineering Academy',
  description: 'Explore 28 learning tracks and 111 structured modules covering TypeScript, React, Next.js, NestJS, PostgreSQL, Prisma, Supabase, security and production engineering.',
};

export default function CourseIndex() {
  return (
    <DocShell>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-600 dark:text-[#7DEBFF]">Structured hands-on curriculum</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Learn modern full-stack engineering</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        {summary.tracks} tracks, {summary.modules} modules and {summary.plannedLessons} mapped topics. Only published lessons contain verified teaching material; the remaining topics are explicitly marked as planned.
      </p>
      <section aria-labelledby="published-title" className="mt-9">
        <h2 id="published-title" className="mb-4 text-xl font-bold">Start with available lessons</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PUBLISHED_LESSON_IDS.map((id) => {
            const lesson = AUTHORED_LESSONS[id];
            const meta = MDX_METADATA.get(id);
            return (
              <Link href={`/learn/${id}`} key={id} className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-cyan-500 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs font-mono text-cyan-700 dark:text-[#7DEBFF]">{id} · {meta?.level ?? lesson.level} · ~{meta?.estimatedMinutes ?? lesson.estMinutes} min</p>
                <h3 className="mt-2 font-bold">{meta?.title ?? lesson.headline}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">{meta?.description ?? lesson.subtitle}</p>
              </Link>
            );
          })}
        </div>
      </section>
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
