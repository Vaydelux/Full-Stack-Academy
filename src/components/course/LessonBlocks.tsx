import type { ReactNode } from 'react';
import Link from 'next/link';

export function LearningGoals({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="learning-goals" className="my-7 rounded-2xl border border-cyan-500/25 bg-cyan-500/[0.06] p-5">
      <h2 id="learning-goals" className="text-base font-bold text-slate-900 dark:text-slate-100">What you will learn</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 dark:text-slate-300">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

export function LessonStep({
  number, title, file, expected, children,
}: {
  number: number;
  title: string;
  file: string;
  expected: string;
  children: ReactNode;
}) {
  return (
    <section aria-label={`Step ${number}: ${title}`} className="my-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <p className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-[#7DEBFF]">Step {number} · {file}</p>
      <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <div className="mt-3 space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{children}</div>
      <div className="mt-4 border-t border-slate-200 pt-3 text-xs leading-6 text-slate-700 dark:border-white/10 dark:text-slate-300">
        <strong>Expected result:</strong> {expected}
      </div>
    </section>
  );
}

export function Misconception({ claim, correction }: { claim: string; correction: string }) {
  return (
    <aside className="my-5 rounded-xl border border-amber-500/25 bg-amber-400/[0.08] p-4 text-sm leading-7" aria-label="Common misconception">
      <p className="font-bold text-amber-800 dark:text-amber-200">Common misconception</p>
      <p className="mt-2 text-slate-700 dark:text-slate-200">{claim}</p>
      <p className="mt-2 text-slate-700 dark:text-slate-200"><strong>Correction:</strong> {correction}</p>
    </aside>
  );
}

export function LabGate({ lessonId, labId, commands, interactive = true }: { lessonId: string; labId: string; commands: string[]; interactive?: boolean }) {
  return (
    <section className="my-7 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
      <h2 className="text-base font-bold">Try it yourself — verified lab path</h2>
      <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
        Lab <code>{labId}</code> has starter and solution files in the repository.
        Complete the starter first, then compare your output against the tests and solution.
        The article does not execute server commands on the website.
      </p>
      <pre className="my-3 overflow-auto rounded-lg bg-[#0B0D14] p-4 text-xs leading-6 text-white"><code>{commands.join('\n')}</code></pre>
      {interactive ? <Link href={`/?lesson=${encodeURIComponent(lessonId)}&mode=practice`} className="inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600">
        Open the browser-safe interactive exercise
      </Link> : <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Run this lab locally in Node.js. No browser simulation or server-side execution.</p>}
      <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
        Lab results are verified locally by the developer. Course progress currently remains self-assessed in this browser.
      </p>
    </section>
  );
}
