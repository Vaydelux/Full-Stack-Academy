'use client';

import { useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Bug,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Eye,
  FileText,
  Flag,
  Lightbulb,
  Play,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
  XCircle,
} from 'lucide-react';
import {
  AUTHORED_LESSONS,
  AUTHORED_LESSON_IDS,
  AUTHORED_REFERENCES,
  findAuthoredReference,
} from '@/lib/academy/authored-content';
import {
  CAPSTONE_MILESTONES,
  MASTER_DOCUMENTS,
  TRACK_GROUPS,
  lessonMap,
  moduleMap,
  referenceMap,
  summary,
  trackMap,
} from '@/lib/academy/curriculum';
import { useAcademy } from '@/lib/academy/store';
import type { AuthoredLesson, CurriculumLesson, ReferenceSubject } from '@/lib/academy/types';
import {
  LifecycleVisualizer,
  PipelineVisualizer,
  StateFlowVisualizer,
} from './visualizers';

/* ------------------------------------------------------------------ */
/* Shared UI primitives                                                */
/* ------------------------------------------------------------------ */

function CodeCard({
  code,
  file,
  loadLessonId,
  onJumpStep,
}: {
  code: string;
  file: string;
  loadLessonId?: string;
  onJumpStep?: () => void;
}) {
  const loadSnippet = useAcademy((s) => s.loadSnippet);
  const showToast = useAcademy((s) => s.showToast);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      showToast('Clipboard unavailable', 'error');
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-700/80 bg-[#0B0D14] shadow-md">
      <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.03] px-3 py-2">
        <span className="font-mono text-[11px] text-slate-300">{file}</span>
        <div className="ml-auto flex items-center gap-1.5">
          {onJumpStep && (
            <button
              type="button"
              onClick={onJumpStep}
              className="flex items-center gap-1 rounded-md border border-[#8A2BE2]/40 bg-[#8A2BE2]/15 px-2 py-0.5 text-[10px] font-semibold text-[#C9A0FF] hover:bg-[#8A2BE2]/25"
            >
              <Play className="h-2.5 w-2.5" />
              Step
            </button>
          )}
          {loadLessonId && (
          <button
            type="button"
            onClick={() => loadSnippet(code, file, loadLessonId)}
            className="flex items-center gap-1 rounded-md border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#7DEBFF] hover:bg-[#00F0FF]/20"
          >
            Load in Editor
            <ArrowUpRight className="h-2.5 w-2.5" />
          </button>
          )}
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300 hover:bg-white/10"
          >
            {copied ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="max-h-60 overflow-auto p-3.5 font-mono text-[11px] leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn' | 'tip';
  title: string;
  children: React.ReactNode;
}) {
  const styles =
    tone === 'warn'
      ? 'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100'
      : tone === 'tip'
        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100'
        : 'border-[#0284c7]/35 bg-[#0284c7]/[0.08] text-slate-800 dark:border-[#00F0FF]/30 dark:bg-[#00F0FF]/[0.06] dark:text-slate-200';
  const Icon = tone === 'warn' ? TriangleAlert : tone === 'tip' ? Lightbulb : Sparkles;

  return (
    <div className={`my-4 flex gap-3 rounded-xl border p-3.5 text-xs leading-relaxed ${styles}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="font-bold">{title}</div>
        <div className="mt-1 opacity-90">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* View 1: Overview                                                    */
/* ------------------------------------------------------------------ */

function OverviewView() {
  const selectLesson = useAcademy((s) => s.selectLesson);
  const selectReference = useAcademy((s) => s.selectReference);
  const setActiveView = useAcademy((s) => s.setActiveView);
  const setSidebarTab = useAcademy((s) => s.setSidebarTab);

  return (
    <div className="space-y-6 pb-16">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0284c7] dark:text-[#00F0FF]">
          FULL-STACK ENGINEERING ACADEMY · V1.1
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Enterprise Curriculum Architecture &amp; Interactive Reader
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
          A content-first, decision-driven engineering academy modeled around explicit mental models, runnable labs, bug hunts, and a separate API reference encyclopedia.
        </p>
      </div>

      {/* Scope metrics */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { value: summary.tracks, label: 'Learning tracks' },
          { value: summary.modules, label: 'Structured modules' },
          { value: summary.plannedLessons, label: 'Planned lesson topics' },
          { value: summary.referenceSubjects, label: 'Indexed reference subjects' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-white/[0.08] dark:bg-white/[0.03]"
          >
            <div className="font-mono text-2xl font-extrabold text-slate-900 dark:text-[#7DEBFF]">
              {item.value}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>

      <Callout tone="warn" title="Honest status: catalog assembled, 4 sample lessons &amp; 4 reference drafts authored">
        All <strong>{summary.plannedLessons}</strong> topics and <strong>{summary.referenceSubjects}</strong> reference subjects are mapped and searchable. Only <strong>4 sample lessons</strong> and <strong>4 reference drafts</strong> have authored lesson bodies; the remaining 885 lessons, 299 reference articles, runnable starter/solution verification suites, and production Fumadocs/NestJS platform still need authoring and verification one module at a time.
      </Callout>

      {/* 8 Track Groups */}
      <section>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          How the course is organized
        </h2>
        <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.02]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.03]">
              <tr>
                <th className="px-3 py-2">Track group</th>
                <th className="px-3 py-2">Main subjects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {TRACK_GROUPS.map((grp) => (
                <tr key={grp.id}>
                  <td className="px-3 py-2 align-top font-semibold text-slate-800 dark:text-slate-200">
                    {grp.name}
                    <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                      Tracks {grp.trackIds[0]}–{grp.trackIds[grp.trackIds.length - 1]}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{grp.subjects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4 Sample Lessons */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            4 Authored sample lessons
          </h2>
          <button
            type="button"
            onClick={() => setActiveView('arena')}
            className="text-[11px] font-semibold text-[#6d28d9] hover:underline dark:text-[#C9A0FF]"
          >
            Open Bug Hunt Arena →
          </button>
        </div>
        <div className="mt-2.5 grid gap-2.5">
          {AUTHORED_LESSON_IDS.map((id) => {
            const lesson = AUTHORED_LESSONS[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectLesson(id)}
                className="rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-colors hover:border-[#0284c7]/50 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-[#00F0FF]/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-[#0284c7] dark:text-[#7DEBFF]">
                    {lesson.id} · {lesson.level}
                  </span>
                  <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-[#6EE7B7]">
                    Interactive sample
                  </span>
                </div>
                <div className="mt-1 text-xs font-bold text-slate-900 dark:text-slate-100">
                  {lesson.headline}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">{lesson.subtitle}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4 Reference Drafts */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            4 Authored reference library entries
          </h2>
          <button
            type="button"
            onClick={() => setSidebarTab('reference')}
            className="text-[11px] font-semibold text-[#0284c7] hover:underline dark:text-[#7DEBFF]"
          >
            Browse 303 subjects →
          </button>
        </div>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {AUTHORED_REFERENCES.map((ref) => {
            const indexEntry = referenceMap.get(ref.id) ?? {
              id: ref.id,
              category: ref.matchCategories[0],
              title: ref.matchTitles[0],
            };
            return (
              <button
                key={ref.id}
                type="button"
                onClick={() => selectReference(indexEntry.id)}
                className="rounded-xl border border-slate-200 bg-white p-3 text-left transition-colors hover:border-[#8A2BE2]/50 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-[#8A2BE2]/50"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6d28d9] dark:text-[#C9A0FF]">
                  {ref.category}
                </div>
                <div className="mt-1 text-xs font-bold text-slate-900 dark:text-slate-100">
                  {ref.heading}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Master Documents */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Additional specification documents
          </h2>
          <button
            type="button"
            onClick={() => setActiveView('capstone')}
            className="text-[11px] font-semibold text-emerald-700 hover:underline dark:text-[#6EE7B7]"
          >
            View 13 Capstone Milestones →
          </button>
        </div>
        <div className="mt-2.5 grid gap-2.5">
          {MASTER_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/[0.08] dark:bg-white/[0.02]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                  <FileText className="h-3.5 w-3.5 text-[#0284c7] dark:text-[#00F0FF]" />
                  {doc.title}
                </div>
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-white/5 dark:text-slate-400">
                  {doc.fileName}
                </code>
              </div>
              <div className="mt-1 text-[10px] font-semibold text-[#6d28d9] dark:text-[#C9A0FF]">
                {doc.scope}
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                {doc.summary}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* View 2: Authored Lesson (Full 10-Stage Pedagogy)                    */
/* ------------------------------------------------------------------ */

function AuthoredLessonView({ lesson }: { lesson: AuthoredLesson }) {
  const catalogEntry = lessonMap.get(lesson.id);
  const progress = useAcademy((s) => s.progress);
  const seek = useAcademy((s) => s.seek);
  const play = useAcademy((s) => s.play);
  const applyStep = useAcademy((s) => s.applyStep);
  const loadSnippet = useAcademy((s) => s.loadSnippet);
  const markQuizPassed = useAcademy((s) => s.markQuizPassed);
  const toggleRubricItem = useAcademy((s) => s.toggleRubricItem);
  const setReflection = useAcademy((s) => s.setReflection);
  const markLessonComplete = useAcademy((s) => s.markLessonComplete);
  const selectLesson = useAcademy((s) => s.selectLesson);
  const selectReference = useAcademy((s) => s.selectReference);

  const [pickedQuiz, setPickedQuiz] = useState<number | null>(null);
  const [predictOpen, setPredictOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);

  const quizPassed = Boolean(progress.quizzes[lesson.id]);
  const checkedIndices = progress.rubrics[lesson.id] ?? [];
  const allRubricChecked = lesson.challenge.rubric.every((_, i) => checkedIndices.includes(i));
  const completed = Boolean(progress.complete[lesson.id]);

  const idx = AUTHORED_LESSON_IDS.indexOf(lesson.id as (typeof AUTHORED_LESSON_IDS)[number]);
  const prevId = AUTHORED_LESSON_IDS[(idx + AUTHORED_LESSON_IDS.length - 1) % AUTHORED_LESSON_IDS.length];
  const nextId = AUTHORED_LESSON_IDS[(idx + 1) % AUTHORED_LESSON_IDS.length];

  return (
    <div className="space-y-6 pb-16">
      {/* Hero */}
      <div className="border-b border-slate-200 pb-5 dark:border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0284c7] dark:text-[#00F0FF]">
          <span>{catalogEntry?.track}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500">{catalogEntry?.module}</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          {lesson.headline}
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
          {lesson.subtitle}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span>{lesson.estMinutes} min estimate</span>
          <span>·</span>
          <span>{lesson.level}</span>
          <span>·</span>
          <span className="rounded border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-[#6EE7B7]">
            {lesson.stackBadge}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              seek(0);
              useAcademy.getState().setMobileTab('editor');
              play();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-[#0284c7]/40 bg-[#0284c7]/12 px-3 py-1.5 text-xs font-semibold text-[#0284c7] hover:bg-[#0284c7]/20 dark:border-[#00F0FF]/35 dark:bg-[#00F0FF]/12 dark:text-[#7DEBFF]"
          >
            <Play className="h-3.5 w-3.5" />
            Play timeline walkthrough
          </button>
        </div>
      </div>

      {/* Learning outcomes */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          What you&apos;ll learn
        </h2>
        <ul className="mt-2.5 space-y-1.5">
          {lesson.objectives.map((obj) => (
            <li key={obj} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 1. The problem we're solving */}
      <section>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          The problem we&apos;re solving
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
          {lesson.problem}
        </p>
      </section>

      {/* 2. Mental model + visualizers */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          The mental model
        </h2>
        <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
          {lesson.mentalSummary}
        </p>
        <PipelineVisualizer title="Causal execution flow" steps={lesson.mentalFlow} />
        {lesson.showStateFlowVisualizer && <StateFlowVisualizer />}
        {lesson.showLifecycleVisualizer && <LifecycleVisualizer />}
      </section>

      {/* 3. Predict first */}
      <section className="rounded-xl border border-[#8A2BE2]/30 bg-[#8A2BE2]/[0.06] p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6d28d9] dark:text-[#C9A0FF]">
            Predict first
          </span>
          <button
            type="button"
            onClick={() => setPredictOpen(!predictOpen)}
            className="flex items-center gap-1 rounded-md border border-[#8A2BE2]/35 px-2 py-0.5 text-[11px] font-semibold text-[#6d28d9] dark:text-[#C9A0FF]"
          >
            <Eye className="h-3 w-3" />
            {predictOpen ? 'Hide reasoning' : 'Check prediction'}
          </button>
        </div>
        <p className="mt-2 text-xs font-medium leading-relaxed text-slate-800 dark:text-slate-200">
          {lesson.predictFirst.prompt}
        </p>
        {predictOpen && (
          <p className="mt-2 border-t border-[#8A2BE2]/20 pt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {lesson.predictFirst.answer}
          </p>
        )}
      </section>

      {/* 4. Step-by-step implementation */}
      <section>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Step-by-step implementation
        </h2>
        <div className="mt-3 space-y-5 border-l-2 border-slate-200 pl-4 dark:border-white/[0.1]">
          {lesson.steps.map((step, i) => (
            <div key={step.id} className="relative">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Step {i + 1} · {step.title}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {step.copy}
              </p>
              <CodeCard
                code={step.code}
                file={step.file}
                loadLessonId={lesson.id}
                onJumpStep={() => { applyStep(step.id); useAcademy.getState().setMobileTab('editor'); }}
              />
              <p className="text-[11px] text-slate-500">
                <strong className="text-slate-700 dark:text-slate-300">Expected:</strong> {step.expected}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Knowledge check */}
      <section className="rounded-xl border border-[#8A2BE2]/30 bg-white p-4 dark:bg-[#8A2BE2]/[0.05]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#6d28d9] dark:text-[#C9A0FF]">
          Knowledge check
        </div>
        <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
          {lesson.quiz.question}
        </h3>
        <div className="mt-3 grid gap-2">
          {lesson.quiz.choices.map((choice, i) => {
            const isPicked = pickedQuiz === i || (quizPassed && i === lesson.quiz.answer);
            const isCorrect = i === lesson.quiz.answer;
            return (
              <button
                key={choice}
                type="button"
                onClick={() => {
                  setPickedQuiz(i);
                  if (i === lesson.quiz.answer) markQuizPassed(lesson.id);
                }}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                  isPicked && isCorrect
                    ? 'border-emerald-500/60 bg-emerald-500/12 text-emerald-800 dark:text-[#6EE7B7]'
                    : isPicked && !isCorrect
                      ? 'border-rose-500/60 bg-rose-500/12 text-rose-700 dark:text-rose-300'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#8A2BE2]/40 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-slate-300'
                }`}
              >
                <span className="font-mono text-[10px] font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{choice}</span>
                {isPicked && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                {isPicked && !isCorrect && <XCircle className="h-4 w-4 text-rose-500" />}
              </button>
            );
          })}
        </div>

        {(quizPassed || pickedQuiz !== null) && (
          <div className="mt-3 border-t border-slate-200 pt-2.5 text-xs leading-relaxed text-slate-600 dark:border-white/[0.08] dark:text-slate-300">
            {quizPassed || pickedQuiz === lesson.quiz.answer ? (
              <p>
                <strong className="text-emerald-600 dark:text-[#6EE7B7]">Correct. </strong>
                {lesson.quiz.explanation}
              </p>
            ) : (
              <p className="text-rose-600 dark:text-rose-300">
                Not quite — review the mental model above and try another option.
              </p>
            )}
          </div>
        )}

        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] dark:border-white/[0.06] dark:bg-black/25">
          <div className="font-bold text-slate-700 dark:text-slate-200">
            Common misconception: {lesson.quiz.misconception.claim}
          </div>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {lesson.quiz.misconception.correction}
          </p>
        </div>
      </section>

      {/* 6. Guided challenge */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7] dark:text-[#7DEBFF]">
          Guided challenge (self-assessed)
        </div>
        <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
          {lesson.challenge.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {lesson.challenge.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadSnippet(lesson.challenge.starterCode, `${lesson.id} starter`, lesson.id)}
            className="rounded-lg border border-[#0284c7]/35 bg-[#0284c7]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[#0284c7] dark:border-[#00F0FF]/35 dark:bg-[#00F0FF]/10 dark:text-[#7DEBFF]"
          >
            Load starter into editor
          </button>
          <button
            type="button"
            onClick={() => setHintOpen(!hintOpen)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300"
          >
            {hintOpen ? 'Hide hint' : 'Show hint'}
          </button>
          <button
            type="button"
            onClick={() => setSolutionOpen(!solutionOpen)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300"
          >
            {solutionOpen ? 'Hide model solution' : 'Show model solution'}
          </button>
        </div>

        {hintOpen && (
          <Callout tone="tip" title="Hint">
            {lesson.challenge.hint}
          </Callout>
        )}

        {solutionOpen && (
          <CodeCard code={lesson.challenge.solution} file="model-solution.tsx" loadLessonId={lesson.id} />
        )}

        <div className="mt-4">
          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
            Self-assessed rubric
          </div>
          <p className="mt-0.5 text-[10px] text-slate-500">
            Honest self-check only; automated CLI grading will run in downloadable starter repos.
          </p>
          <div className="mt-2 space-y-2">
            {lesson.challenge.rubric.map((item, i) => (
              <label key={item} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={checkedIndices.includes(i)}
                  onChange={() => toggleRubricItem(lesson.id, i)}
                  className="mt-0.5 accent-[#00F0FF]"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bug Hunt */}
      <section className="rounded-xl border border-amber-500/35 bg-amber-500/[0.07] p-4">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
          <Bug className="h-3.5 w-3.5" />
          Bug Hunt
        </div>
        <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
          {lesson.bugHunt.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {lesson.bugHunt.symptom}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadSnippet(lesson.bugHunt.buggyCode, `${lesson.id} bug hunt`, lesson.id)}
            className="rounded-lg border border-amber-500/40 bg-amber-500/15 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200"
          >
            Load defect into editor
          </button>
          <button
            type="button"
            onClick={() => setBugOpen(!bugOpen)}
            className="rounded-lg border border-slate-300 bg-white/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:border-white/15 dark:bg-black/30 dark:text-slate-200"
          >
            {bugOpen ? 'Hide diagnosis' : 'Reveal diagnosis'}
          </button>
        </div>

        {bugOpen && (
          <div className="mt-3 border-t border-amber-500/25 pt-2.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
            <strong>What went wrong: </strong>
            {lesson.bugHunt.diagnosis}
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {lesson.bugHunt.fixNote}
            </p>
          </div>
        )}
      </section>

      {/* 8. Reflection */}
      <section>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Reflection</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {lesson.reflection}
        </p>
        <textarea
          rows={3}
          value={progress.reflections[lesson.id] ?? ''}
          onChange={(e) => setReflection(lesson.id, e.target.value)}
          placeholder="Write your reasoning—what changed, why it is safer, and when you wouldn't use it..."
          aria-label="Lesson reflection"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 outline-none focus:border-[#0284c7] dark:border-white/[0.1] dark:bg-black/30 dark:text-slate-200"
        />
      </section>

      {/* 9. Official references */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          References &amp; related encyclopedia entries
        </h2>
        <div className="grid gap-1.5">
          {lesson.sources.map((src) => (
            <a
              key={src.url}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-[#0284c7]/50 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-slate-200"
            >
              <span>{src.label}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
            </a>
          ))}
        </div>

        {lesson.relatedReferenceIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {lesson.relatedReferenceIds.map((refId) => {
              const r = referenceMap.get(refId);
              if (!r) return null;
              return (
                <button
                  key={refId}
                  type="button"
                  onClick={() => selectReference(refId)}
                  className="flex items-center gap-1 rounded-md border border-[#8A2BE2]/35 bg-[#8A2BE2]/10 px-2 py-1 text-[11px] font-medium text-[#6d28d9] dark:text-[#C9A0FF]"
                >
                  <BookOpen className="h-3 w-3" />
                  Ref: {r.title}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 10. Completion gate */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Completion gate
        </h3>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {completed
            ? 'Marked complete in this browser preview.'
            : quizPassed && allRubricChecked
              ? 'Knowledge check passed and rubric self-assessed. Ready to mark this sample complete.'
              : 'Pass the knowledge check and check every rubric item before marking complete.'}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            disabled={!quizPassed || !allRubricChecked || completed}
            onClick={() => markLessonComplete(lesson.id)}
            className="rounded-lg bg-[#0284c7] px-3.5 py-2 text-xs font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#00F0FF] dark:text-[#090A0F]"
          >
            {completed ? '✓ Sample lesson complete' : 'Mark sample lesson complete'}
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => selectLesson(prevId)}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/[0.1] dark:text-slate-300 dark:hover:bg-white/[0.05]"
            >
              ← Prev sample
            </button>
            <button
              type="button"
              onClick={() => selectLesson(nextId)}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/[0.1] dark:text-slate-300 dark:hover:bg-white/[0.05]"
            >
              Next sample →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* View 3: Planned Topic (Honest non-authored state)                   */
/* ------------------------------------------------------------------ */

function PlannedLessonView({ entry }: { entry: CurriculumLesson }) {
  const selectLesson = useAcademy((s) => s.selectLesson);
  const setActiveView = useAcademy((s) => s.setActiveView);
  const mod = moduleMap.get(entry.moduleId);
  const track = trackMap.get(entry.trackId);

  return (
    <div className="space-y-5 pb-16">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0284c7] dark:text-[#00F0FF]">
          {entry.track} / {entry.module}
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          {entry.title}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Syllabus ID {entry.id} · Type: {entry.type} · Target {entry.estimatedMinutes} min · Level: {entry.level}
        </p>
      </div>

      <Callout tone="warn" title="Planned topic — not yet authored">
        This topic is locked into the v1.1 curriculum catalog ({summary.plannedLessons} topics across {summary.tracks} tracks), but its full tutorial body, runnable lab fixtures, quizzes, and tests have not been authored yet. Planned topics cannot be marked complete.
      </Callout>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Module &amp; track outcome
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {mod?.outcome ?? track?.outcome}
        </p>
        <a
          href={entry.referenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#0284c7] hover:underline dark:text-[#7DEBFF]"
        >
          Canonical documentation <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => selectLesson('06.01.01')}
          className="rounded-lg bg-[#0284c7] px-3 py-2 text-xs font-semibold text-white dark:bg-[#00F0FF] dark:text-[#090A0F]"
        >
          Open authored JSX sample (06.01.01)
        </button>
        <button
          type="button"
          onClick={() => setActiveView('overview')}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-slate-300"
        >
          Curriculum overview
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* View 4: Reference Encyclopedia                                      */
/* ------------------------------------------------------------------ */

function ReferenceView({ subject }: { subject: ReferenceSubject }) {
  const selectLesson = useAcademy((s) => s.selectLesson);
  const setActiveView = useAcademy((s) => s.setActiveView);
  const authored = findAuthoredReference(subject.category, subject.title);

  return (
    <div className="space-y-5 pb-16">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6d28d9] dark:text-[#C9A0FF]">
          REFERENCE ENCYCLOPEDIA / {subject.category}
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          {authored ? authored.heading : subject.title}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Subject ID: <code>{subject.id}</code> · {authored ? `${authored.majorVersion} · ${authored.status}` : 'Indexed subject (body not yet authored)'}
        </p>
      </div>

      {authored ? (
        <>
          <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">At a glance</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {authored.summary}
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Syntax</h2>
            <CodeCard code={authored.syntax} file={`${subject.slug}.${authored.lang}`} />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed dark:border-white/[0.08] dark:bg-white/[0.02]">
            <div>
              <strong className="text-slate-900 dark:text-slate-100">Parameters: </strong>
              <span className="text-slate-600 dark:text-slate-300">{authored.parameters}</span>
            </div>
            <div className="mt-2">
              <strong className="text-slate-900 dark:text-slate-100">Return values: </strong>
              <span className="text-slate-600 dark:text-slate-300">{authored.returns}</span>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Minimal example</h2>
            <CodeCard code={authored.minimalExample} file={`minimal.${authored.lang}`} />
            <h2 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">Production example</h2>
            <CodeCard code={authored.productionExample} file={`production.${authored.lang}`} />
          </section>

          <Callout tone="warn" title="Common mistakes">
            <ul className="list-disc space-y-1 pl-4">
              {authored.commonMistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </Callout>

          <Callout tone="info" title="Security &amp; performance notes">
            <ul className="list-disc space-y-1 pl-4">
              {authored.securityPerformanceNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Callout>

          {authored.relatedLessonIds.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Related tutorials</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {authored.relatedLessonIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectLesson(id)}
                    className="rounded-lg border border-[#0284c7]/35 bg-[#0284c7]/10 px-3 py-1.5 text-xs font-semibold text-[#0284c7] dark:border-[#00F0FF]/35 dark:bg-[#00F0FF]/10 dark:text-[#7DEBFF]"
                  >
                    Open Lesson {id} →
                  </button>
                ))}
              </div>
            </section>
          )}

          <a
            href={authored.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-800 hover:border-[#0284c7]/50 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-200"
          >
            <span>Official documentation</span>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </a>
        </>
      ) : (
        <>
          <Callout tone="warn" title="Indexed reference subject — body not yet authored">
            <strong>{subject.title}</strong> has a reserved permanent identifier in the 303-subject reference encyclopedia, but its full reference page still needs authoring and verification.
          </Callout>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Required 9-part reference format
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600 dark:text-slate-400">
              <li>Syntax &amp; version status</li>
              <li>Parameters &amp; defaults</li>
              <li>Return values &amp; errors</li>
              <li>Minimal working example</li>
              <li>Production example</li>
              <li>Common mistakes</li>
              <li>Security &amp; performance notes</li>
              <li>Related curriculum tutorials</li>
              <li>Official documentation link</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('overview')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-slate-300"
          >
            ← Back to overview
          </button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* View 5: Bug Hunt Arena                                              */
/* ------------------------------------------------------------------ */

function ArenaView() {
  const selectLesson = useAcademy((s) => s.selectLesson);
  const loadSnippet = useAcademy((s) => s.loadSnippet);

  return (
    <div className="space-y-5 pb-16">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6d28d9] dark:text-[#C9A0FF]">
          DEBUG PRACTICE ZONE
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Bug Hunt Arena
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
          Reading docs teaches the rule. Diagnosing a failing symptom teaches when the rule matters. Four authored bug hunts are ready to inspect.
        </p>
      </div>

      <div className="space-y-3">
        {AUTHORED_LESSON_IDS.map((id) => {
          const l = AUTHORED_LESSONS[id];
          return (
            <article
              key={id}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.03]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-[#0284c7] dark:text-[#7DEBFF]">
                  {id} · {l.level}
                </span>
                <ShieldAlert className="h-4 w-4 text-amber-500" />
              </div>
              <h2 className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                {l.bugHunt.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {l.bugHunt.symptom}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loadSnippet(l.bugHunt.buggyCode, `${id} bug`, id)}
                  className="rounded-lg border border-amber-500/40 bg-amber-500/12 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200"
                >
                  Load defect into editor
                </button>
                <button
                  type="button"
                  onClick={() => selectLesson(id)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-200"
                >
                  Investigate in lesson →
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* View 6: Capstone & Teaching Standard                                */
/* ------------------------------------------------------------------ */

function CapstoneView() {
  return (
    <div className="space-y-5 pb-16">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-[#6EE7B7]">
          PROGRESSIVE CAPSTONE PATH · COLLABSPACE
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          13 Milestones to a Production Platform
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
          Every milestone reinforces the tracks just studied—from requirements and ADR-001 through NestJS, Prisma, Supabase Auth, Redis/BullMQ, CI/CD, observability, load profiling, and enterprise readiness.
        </p>
      </div>

      <div className="space-y-3">
        {CAPSTONE_MILESTONES.map((m) => (
          <div
            key={m.number}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.03]"
          >
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:text-[#6EE7B7]">
                Milestone {m.number}
              </span>
              <span className="text-[11px] text-slate-500">{m.learningAreas}</span>
            </div>
            <h2 className="mt-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
              {m.title}
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">Build: </strong>
              {m.build}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">Verify: </strong>
              {m.verify}
            </p>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              <strong>Bug hunt: </strong>
              {m.bugHunt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main DocsPane                                                       */
/* ------------------------------------------------------------------ */

export default function DocsPane() {
  const activeView = useAcademy((s) => s.activeView);
  const setActiveView = useAcademy((s) => s.setActiveView);
  const selectedLessonId = useAcademy((s) => s.selectedLessonId);
  const selectedReferenceId = useAcademy((s) => s.selectedReferenceId);

  const authoredLesson = AUTHORED_LESSONS[selectedLessonId];
  const plannedLesson = lessonMap.get(selectedLessonId);
  const refSubject = referenceMap.get(selectedReferenceId);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Quick view switcher */}
      <div className="flex shrink-0 items-center gap-1 border-b border-slate-200 bg-white/60 px-4 py-1.5 dark:border-white/[0.06] dark:bg-black/20">
        {(
          [
            { id: 'overview', label: 'Overview', icon: Compass },
            { id: 'lesson', label: 'Lesson', icon: FileText },
            { id: 'arena', label: 'Bug Hunt', icon: Bug },
            { id: 'capstone', label: 'Capstone', icon: Flag },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                active
                  ? 'bg-[#0284c7]/12 text-[#0284c7] dark:bg-[#00F0FF]/12 dark:text-[#7DEBFF]'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-3 w-3" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable reading column */}
      <div key={`${activeView}:${selectedLessonId}:${selectedReferenceId}`} className="min-h-0 flex-1 overflow-y-auto px-5 pt-7 sm:px-8">
        <div className="academy-reading mx-auto max-w-[760px]">
        {activeView === 'overview' && <OverviewView />}
        {activeView === 'arena' && <ArenaView />}
        {activeView === 'capstone' && <CapstoneView />}
        {activeView === 'reference' && (refSubject ? <ReferenceView subject={refSubject} /> : <OverviewView />)}
        {activeView === 'lesson' &&
          (authoredLesson ? (
            <AuthoredLessonView key={authoredLesson.id} lesson={authoredLesson} />
          ) : plannedLesson ? (
            <PlannedLessonView key={plannedLesson.id} entry={plannedLesson} />
          ) : (
            <OverviewView />
          ))}
        </div>
      </div>
    </div>
  );
}
