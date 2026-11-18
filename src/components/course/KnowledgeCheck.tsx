'use client';

import { useId, useState } from 'react';
import { useAcademy } from '@/lib/academy/store';

export function KnowledgeCheck({
  question, choices, correctIndex, explanation, misconception, lessonId,
}: {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  misconception: string;
  lessonId?: string;
}) {
  const group = useId();
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const passed = submitted && selected === correctIndex;

  return (
    <section aria-label="Practice knowledge check" className="my-7 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <h2 className="text-base font-bold">Knowledge check</h2>
      <fieldset className="mt-3">
        <legend className="text-sm font-semibold leading-7 text-slate-800 dark:text-slate-100">{question}</legend>
        <div className="mt-3 space-y-2">
          {choices.map((choice, i) => (
            <label key={i} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm leading-6 transition-colors ${selected === i ? 'border-cyan-500 bg-cyan-500/[0.06]' : 'border-slate-200 hover:border-cyan-400 dark:border-white/10'}`}>
              <input type="radio" name={group} checked={selected === i} onChange={() => { setSelected(i); setSubmitted(false); }} className="mt-1 accent-cyan-600" />
              <span>{String.fromCharCode(65 + i)}. {choice}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button type="button" disabled={selected === null} onClick={() => { setSubmitted(true); if (lessonId && selected === correctIndex) { const store = useAcademy.getState(); if (!store.hydrated) store.hydrate(); useAcademy.getState().markQuizPassed(lessonId); } }} className="mt-4 rounded-lg bg-cyan-700 px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#00F0FF] dark:text-[#090A0F]">
        Check answer
      </button>
      {submitted && (
        <div role="status" aria-live="polite" className={`mt-4 rounded-xl border p-4 text-sm leading-7 ${passed ? 'border-emerald-500/30 bg-emerald-500/[0.07]' : 'border-amber-500/30 bg-amber-500/[0.07]'}`}>
          <p className="font-bold">{passed ? 'Correct — you identified the concept.' : 'Not quite. Review the mental model and retry.'}</p>
          <p className="mt-2">{passed ? explanation : misconception}</p>
          {!passed && <button type="button" className="mt-2 text-xs font-semibold underline" onClick={() => { setSelected(null); setSubmitted(false); }}>Retry question</button>}
        </div>
      )}
      <p className="mt-3 text-xs text-slate-500">{lessonId ? 'Correct answers save local self-assessment progress.' : 'Practice only; answers here are not stored as verified course credit.'}</p>
    </section>
  );
}
