'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/lib/academy/store';
import { PUBLISHED_LESSON_IDS } from '@/lib/academy/published';
import { lessonMap } from '@/lib/academy/curriculum';

export function LocalLessonCompletion({ lessonId, rubric }: {lessonId:string; rubric:string[]}) {
  const hydrated = useAcademy(s=>s.hydrated);
  const hydrate = useAcademy(s=>s.hydrate);
  const progress = useAcademy(s=>s.progress);
  const toggle = useAcademy(s=>s.toggleRubricItem);
  const complete = useAcademy(s=>s.markLessonComplete);
  useEffect(()=>{ if (!hydrated) hydrate(); },[hydrated,hydrate]);
  const passed = Boolean(progress.quizzes[lessonId]);
  const checked = progress.rubrics[lessonId] ?? [];
  const done = Boolean(progress.complete[lessonId]);
  const next = PUBLISHED_LESSON_IDS[PUBLISHED_LESSON_IDS.indexOf(lessonId)+1];
  return (
    <section className="my-8 rounded-2xl border border-slate-200 p-5 dark:border-white/10" aria-label="Lesson completion">
      <h2 className="text-lg font-bold">Complete your lesson</h2>
      <p className="my-3 text-sm text-slate-500">Answer the knowledge check correctly and confirm local practice. This is self-assessment, not independently verified grading.</p>
      {rubric.map((item,index)=><label key={item} className="mb-3 flex items-start gap-2 text-sm"><input type="checkbox" disabled={!hydrated} checked={checked.includes(index)} onChange={()=>toggle(lessonId,index)} className="mt-1"/>{item}</label>)}
      <p role="status" className="my-3 text-sm">{passed?'Knowledge check passed.':'Knowledge check still required.'} {done?'Lesson complete.':''}</p>
      <button type="button" onClick={()=>complete(lessonId)} disabled={!hydrated||!passed||!rubric.every((_,i)=>checked.includes(i))||done} className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-40">{done?'Completed':'Mark complete'}</button>
      {done&&next&&<Link href={`/learn/${next}`} className="ml-3 text-sm font-semibold text-cyan-700 dark:text-cyan-300">Next: {lessonMap.get(next)?.title}</Link>}
    </section>
  );
}
