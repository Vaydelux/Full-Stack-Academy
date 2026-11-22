import type { Metadata } from 'next';
import Link from 'next/link';
import { DocShell } from '@/components/course/DocShell';
import { readCourseProgress } from '@/lib/academy/course-progress-server';

export const metadata: Metadata = {
  title: 'Course Development Roadmap | Full-Stack Academy',
  description: 'Track which Full-Stack Academy topics are published, authored as drafts, and still planned.',
  robots: {index:false,follow:true},
};

export default function CourseRoadmapPage() {
  const progress=readCourseProgress();
  return (
    <DocShell>
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-slate-500">
        <Link href="/learn" className="hover:underline">Curriculum</Link> / Course roadmap
      </nav>
      <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">Course development</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Publication roadmap</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        This shows how much of the curriculum has been written and released. It is
        separate from <Link href="/learn/dashboard" className="font-semibold underline underline-offset-4">your personal learning progress</Link>.
        An authored draft is not a published lesson, runnable hosted lab, or passed release check.
      </p>
      <section className="mt-7 grid gap-3 sm:grid-cols-3" aria-label="Publication progress">
        {[
          { label:'Published and available', value:progress.published,detail:'Available to learners now' },
          { label:'Authored drafts', value:progress.drafted,detail:'Not yet released or qualified' },
          { label:'Still to author', value:progress.toAuthor,detail:'Canonical syllabus topics remaining' },
        ].map(stat=>(
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.035]">
            <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-extrabold tabular-nums">{stat.value}<span className="ml-1 text-sm font-normal text-slate-500">/ {progress.total}</span></p>
            <p className="mt-2 text-xs text-slate-500">{stat.detail}</p>
          </div>
        ))}
      </section>
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.035]">
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <strong>Published curriculum</strong>
          <span className="tabular-nums">{Math.round(100*progress.published/progress.total)}%</span>
        </div>
        <progress aria-label="Published lesson share" max={progress.total} value={progress.published} className="mt-3 h-3 w-full accent-cyan-700 dark:accent-cyan-400"/>
        <p className="mt-2 text-xs text-slate-500">Only the published share is learner-accessible. Drafts do not inflate this percentage.</p>
      </div>
      <section className="mt-9 space-y-4" aria-labelledby="phases-title">
        <h2 id="phases-title" className="text-xl font-bold">Roadmap by phase</h2>
        <p className="text-sm leading-6 text-slate-500">Expand a phase to see individual modules. The figures are read from the repository and can change when lesson metadata is authored or published.</p>
        {progress.phases.map(phase=>(
          <details key={phase.id} open={phase.id==='P1'||phase.id==='P3'} className="rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.035]">
            <summary className="cursor-pointer rounded-xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold">{phase.id} · {phase.title}</span>
                <span className="text-xs tabular-nums text-slate-500">{phase.published} published · {phase.drafted} drafted · {phase.toAuthor} planned</span>
              </span>
            </summary>
            <div className="border-t border-slate-200 px-4 pb-4 pt-3 dark:border-white/10">
              <p className="mb-3 text-xs leading-6 text-slate-500">{phase.goal}</p>
              <ul className="space-y-2">
                {phase.modules.map(module=>(
                  <li key={module.id} className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={'/learn/track/'+module.track} className="text-sm font-semibold text-cyan-700 underline-offset-2 hover:underline dark:text-cyan-300">{module.id} · {module.title}</Link>
                        <p className="mt-1 text-xs text-slate-500">{module.published}/{module.total} published · {module.drafted} drafts · {module.toAuthor} not authored</p>
                      </div>
                      <span className="text-xs text-slate-500">{module.status==='authored-draft'?'In editorial review':module.status==='published'?'Published':module.status==='in-progress'?'Partially published':'Planned'}</span>
                    </div>
                    <progress aria-label={module.title+' published share'} max={module.total||1} value={module.published} className="mt-2 h-2 w-full accent-cyan-700 dark:accent-cyan-400"/>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </section>
      <p className="mt-8 text-xs leading-6 text-slate-500">
        Progress is source-derived rather than a promise of production readiness. Runtime, browser,
        and accessibility qualification remain separate release gates. No draft completion or
        learner score is generated on this page.
      </p>
    </DocShell>
  );
}
