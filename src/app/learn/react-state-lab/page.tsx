import type { Metadata } from 'next';
import Link from 'next/link';
import { ReactStateLab } from '@/components/course/ReactStateLab';

export const metadata: Metadata = {
  title: 'React State Practice | Full-Stack Academy',
  description: 'Locally rendered React practice for functional state updates, reducers and keyed form identity.',
  robots: { index: false, follow: true },
};

export default function ReactStatePracticePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12 text-slate-900 dark:text-slate-100 sm:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <Link href="/learn" className="font-medium text-cyan-700 underline underline-offset-4 dark:text-cyan-300">Curriculum</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/learn/06.02.08" className="font-medium text-cyan-700 underline underline-offset-4 dark:text-cyan-300">React state</Link>
      </nav>
      <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">React 19 · Browser practice</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">State, identity, and reducers</h1>
      <p className="my-6 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
        This is an actual interactive React client component, not a remote code executor.
        Test the controls, then inspect the matching offline starter and instructor source in the repository.
        Results are not sent to a backend or counted as automatic course mastery.
      </p>
      <ReactStateLab />
      <p className="mt-8 text-sm leading-6">
        <Link href="/learn/06.02.08" className="font-semibold text-cyan-700 underline underline-offset-4 dark:text-cyan-300">Return to the stale-closure debugging lesson</Link>
      </p>
    </main>
  );
}
