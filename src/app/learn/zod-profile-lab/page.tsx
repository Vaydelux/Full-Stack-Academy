import type {Metadata} from 'next';
import Link from 'next/link';
import {DocShell} from '@/components/course/DocShell';
import {ZodProfileLab} from '@/components/course/ZodProfileLab';

export const metadata:Metadata={
 title:'Zod 4 Profile Validation Lab | Full-Stack Academy',
 description:'Validate a sample profile using the same Zod 4 schema as the local academy exercises, without a backend or data storage.',
 robots:{index:false,follow:true},
};

export default function ZodProfilePracticePage(){
 return <DocShell active="09.01.08">
  <nav aria-label="Breadcrumb" className="text-sm">
   <Link href="/learn" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Curriculum</Link>
   <span aria-hidden="true"> / </span>
   <Link href="/learn/09.01.08" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Validated profile form</Link>
  </nav>
  <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-cyan-300">Zod 4 · Browser-only practice</p>
  <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Validate a profile with Zod</h1>
  <p className="my-6 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
   Use genuine Zod 4 validation in your browser. Inspect normalized output, rejected fields and accessible errors.
   This practice doesn't send information to a backend, save it in storage or register an account.
  </p>
  <ZodProfileLab />
  <p className="mt-8 text-sm"><Link href="/learn/09.01.08" className="font-semibold text-cyan-700 underline underline-offset-4 dark:text-cyan-300">Return to the Zod profile capstone lesson</Link></p>
 </DocShell>;
}
