import type { Metadata } from 'next';
import Link from 'next/link';
import { DocShell } from '@/components/course/DocShell';

export const metadata: Metadata = {
  title: 'Practice Projects | Full-Stack Engineering Academy',
  description: 'Explore guided local engineering projects, testing scenarios and real HTTP workflows. Projects do not imply automatic grading.',
  robots: { index: false, follow: true },
};

export default function PracticeProjectsPage() {
  return (
    <DocShell>
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500"><Link href="/learn" className="hover:underline">Curriculum</Link> / Practice projects</nav>
      <p className="text-xs font-extrabold uppercase tracking-[.2em] text-cyan-700 dark:text-cyan-300">Build and debug</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Practice projects</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">Use complete, inspectable local project fixtures to connect individual concepts to real HTTP behavior. These projects are source examples, not automatically graded academy lessons or cloud-hosted sandboxes.</p>
      <section aria-labelledby="project-list-title" className="mt-9">
        <h2 id="project-list-title" className="mb-4 text-xl font-bold">Available local source projects</h2>
        <article className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.035]">
          <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">Forms · Remote data · HTTP security</p>
          <h3 className="mt-3 text-xl font-bold">Reliable Task Workflow</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Implement task validation, idempotent creation, version-checked edits, status filtering, cursor pagination and retry behavior with a real local Node API. Includes a browser-native practice UI, contract tests and separately qualified React source.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-slate-300 px-3 py-1 dark:border-white/20">Loopback only</span>
            <span className="rounded-full border border-slate-300 px-3 py-1 dark:border-white/20">No production auth</span>
          </div>
          <Link href="/learn/projects/forms-query" className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-cyan-700 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-800">View project and run locally</Link>
        </article>
      </section>
    </DocShell>
  );
}
