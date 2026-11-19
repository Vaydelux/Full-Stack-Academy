import type {Metadata} from 'next';
import Link from 'next/link';
import {DocShell} from '@/components/course/DocShell';
import {StateBoundariesLab} from '@/components/course/StateBoundariesLab';

export const metadata:Metadata={
 title:'Zustand 5 State Boundaries Lab | Full-Stack Academy',
 description:'Practice typed Zustand 5 stores, stable selectors, catalogue filters, density and reset in a browser-only exercise.',
 robots:{index:false,follow:true},
};

export default function StateBoundariesPracticePage(){
 return <DocShell active="09.04.08">
  <nav aria-label="Breadcrumb" className="text-sm">
   <Link href="/learn" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Curriculum</Link>
   <span aria-hidden="true"> / </span>
   <Link href="/learn/09.04.08" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Filters and preferences capstone</Link>
  </nav>
  <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-cyan-300">Zustand 5 · Browser-only practice</p>
  <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Build a predictable filter store</h1>
  <p className="my-6 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
   Filter a small local catalogue with a genuine Zustand 5 vanilla store. Inspect which state belongs in memory
   versus a shareable URL or server data cache. This practice sends no data to a backend.
  </p>
  <StateBoundariesLab/>
  <p className="mt-8 text-sm"><Link href="/learn/09.04.08" className="font-semibold text-cyan-700 underline underline-offset-4 dark:text-cyan-300">Return to the state boundaries capstone lesson</Link></p>
 </DocShell>;
}
