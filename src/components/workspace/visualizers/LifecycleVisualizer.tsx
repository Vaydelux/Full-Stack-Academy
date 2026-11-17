'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, RefreshCcwDot, Repeat, Terminal } from 'lucide-react';

type PhaseId = 'mount' | 'update' | 'unmount';

interface Phase {
  id: PhaseId;
  label: string;
  steps: string[];
  pillBorder: string;
  pillBg: string;
  pillText: string;
  pillShadow: string;
  stepIndex: string;
}

const PHASES: Phase[] = [
  {
    id: 'mount',
    label: 'Mount',
    steps: [
      'useState initializers run',
      'App() renders for the first time',
      'React commits the tree to the DOM',
      'useEffect callbacks fire (after paint)',
    ],
    pillBorder: 'border-[#10B981]/50',
    pillBg: 'bg-[#10B981]/10',
    pillText: 'text-[#047857] dark:text-[#34D399]',
    pillShadow: 'shadow-[0_0_16px_rgba(16,185,129,0.2)]',
    stepIndex: 'text-[#047857] dark:text-[#34D399]',
  },
  {
    id: 'update',
    label: 'Update',
    steps: [
      'A handler calls setState',
      'React re-runs App() with fresh state',
      'DOM is diffed and patched minimally',
      'Previous cleanup runs, then effects re-fire',
    ],
    pillBorder: 'border-[#00F0FF]/50',
    pillBg: 'bg-[#00F0FF]/10',
    pillText: 'text-[#0284c7] dark:text-[#7DEBFF]',
    pillShadow: 'shadow-[0_0_16px_rgba(0,240,255,0.2)]',
    stepIndex: 'text-[#0284c7] dark:text-[#00F0FF]',
  },
  {
    id: 'unmount',
    label: 'Unmount',
    steps: [
      'Cleanup functions run (listeners, timers)',
      'React removes the DOM nodes',
      'Memory is released - the component is gone',
    ],
    pillBorder: 'border-[#8A2BE2]/50',
    pillBg: 'bg-[#8A2BE2]/10',
    pillText: 'text-[#6d28d9] dark:text-[#B388FF]',
    pillShadow: 'shadow-[0_0_16px_rgba(138,43,226,0.25)]',
    stepIndex: 'text-[#6d28d9] dark:text-[#B388FF]',
  },
];

const KIND_COLORS: Record<PhaseId, string> = {
  mount: '#34D399',
  update: '#00F0FF',
  unmount: '#B388FF',
};

const MICRO_LABEL =
  'text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold';

const DEMO_BUTTON =
  'flex items-center gap-1.5 rounded-lg border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-1.5 text-xs font-medium text-[#047857] transition-all hover:bg-[#10B981]/20 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:text-[#34D399]';

const RERENDER_BUTTON =
  'flex items-center gap-1.5 rounded-lg border border-[#0284c7]/30 bg-[#0284c7]/10 px-3 py-1.5 text-xs font-medium text-[#0284c7] transition-all hover:bg-[#0284c7]/20 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:border-[#00F0FF]/30 dark:bg-[#00F0FF]/10 dark:text-[#7DEBFF] dark:hover:bg-[#00F0FF]/20';

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

interface LogLine {
  id: number;
  kind: PhaseId;
  text: string;
}

interface DemoStep {
  at: number;
  phase: PhaseId;
  text: string;
}

const DEMO_SCRIPT: DemoStep[] = [
  { at: 0, phase: 'mount', text: '[mount] effect fired' },
  { at: 700, phase: 'update', text: '[update] cleanup -> effect (count 1)' },
  { at: 1400, phase: 'update', text: '[update] cleanup -> effect (count 2)' },
  { at: 2100, phase: 'unmount', text: '[unmount] cleanup ran' },
];

export default function LifecycleVisualizer({ className }: { className?: string }) {
  const [phaseId, setPhaseId] = useState<PhaseId>('mount');
  const [log, setLog] = useState<LogLine[]>([]);
  const [playing, setPlaying] = useState<boolean>(false);

  const logRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const lineId = useRef<number>(0);
  const renderCount = useRef<number>(1);

  const phase = PHASES.find((p) => p.id === phaseId) ?? PHASES[0];

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const pushLine = (kind: PhaseId, text: string) => {
    lineId.current += 1;
    const entry: LogLine = { id: lineId.current, kind, text };
    setLog((prev) => [...prev, entry].slice(-8));
  };

  const runDemo = () => {
    if (playing) return;
    setPlaying(true);
    DEMO_SCRIPT.forEach((step) => {
      timers.current.push(
        setTimeout(() => {
          setPhaseId(step.phase);
          pushLine(step.phase, step.text);
        }, step.at),
      );
    });
    timers.current.push(setTimeout(() => setPlaying(false), 2900));
  };

  const rerender = () => {
    if (playing) return;
    pushLine('update', `[update] cleanup -> effect (count ${renderCount.current})`);
    renderCount.current += 1;
    setPhaseId('update');
  };

  return (
    <div
      className={cx(
        'rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-none',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#8A2BE2]/25 bg-[#8A2BE2]/10">
            <RefreshCcwDot size={16} className="text-[#6d28d9] dark:text-[#B388FF]" />
          </div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Component lifecycle, phase by phase
          </h3>
        </div>
        <span className={MICRO_LABEL}>Interactive</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {PHASES.map((p) => {
          const selected = phaseId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPhaseId(p.id)}
              className={cx(
                'rounded-full border px-3.5 py-1.5 font-mono text-xs transition-all duration-200',
                selected
                  ? cx(p.pillBorder, p.pillBg, p.pillText, p.pillShadow)
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-slate-400 dark:hover:border-white/[0.16] dark:hover:text-slate-200',
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className={MICRO_LABEL}>Sequence</span>
        <span
          className={cx(
            'text-[10px] uppercase tracking-[0.18em] font-semibold',
            phase.stepIndex,
          )}
        >
          {phase.label}
        </span>
      </div>

      <div className="mt-2 min-h-[11rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col gap-2"
          >
            {phase.steps.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.25, ease: 'easeOut' }}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.02]"
              >
                <span
                  className={cx('font-mono text-[11px] tabular-nums', phase.stepIndex)}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                  {step}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-slate-500" />
          <span className={MICRO_LABEL}>Console</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={rerender}
            disabled={playing}
            className={RERENDER_BUTTON}
          >
            <Repeat size={13} />
            Re-render
          </button>
          <button
            type="button"
            onClick={runDemo}
            disabled={playing}
            className={DEMO_BUTTON}
          >
            <Play size={13} />
            {playing ? 'Running...' : 'Run demo'}
          </button>
        </div>
      </div>

      <div
        ref={logRef}
        className="mt-2 max-h-24 overflow-y-auto rounded-xl border border-slate-200 bg-slate-900 p-2 dark:border-white/[0.06] dark:bg-black/30"
      >
        {log.length === 0 ? (
          <div className="py-0.5 font-mono text-[11px] text-slate-600">
            {'// console output appears here'}
          </div>
        ) : (
          log.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center gap-2 py-0.5 font-mono text-[11px]"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: KIND_COLORS[line.kind],
                  boxShadow: `0 0 6px ${KIND_COLORS[line.kind]}`,
                }}
              />
              <span className="text-slate-400">{line.text}</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
