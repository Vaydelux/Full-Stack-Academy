'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, Workflow } from 'lucide-react';

type AccentKey = 'cyan' | 'violet' | 'emerald';

interface AccentStyle {
  border: string;
  bg: string;
  text: string;
  shadow: string;
  dot: string;
}

const ACCENTS: Record<AccentKey, AccentStyle> = {
  cyan: {
    border: 'border-[#00F0FF]/60',
    bg: 'bg-[#00F0FF]/10',
    text: 'text-[#0284c7] dark:text-[#7DEBFF]',
    shadow: 'shadow-[0_0_20px_rgba(0,240,255,0.25)]',
    dot: '#00F0FF',
  },
  violet: {
    border: 'border-[#8A2BE2]/60',
    bg: 'bg-[#8A2BE2]/10',
    text: 'text-[#6d28d9] dark:text-[#B388FF]',
    shadow: 'shadow-[0_0_20px_rgba(138,43,226,0.3)]',
    dot: '#B388FF',
  },
  emerald: {
    border: 'border-[#10B981]/60',
    bg: 'bg-[#10B981]/10',
    text: 'text-[#047857] dark:text-[#34D399]',
    shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    dot: '#34D399',
  },
};

interface FlowNode {
  label: string;
  accent: AccentKey;
}

const NODES: FlowNode[] = [
  { label: 'Event', accent: 'cyan' },
  { label: 'setCount()', accent: 'violet' },
  { label: 'Render', accent: 'violet' },
  { label: 'Commit', accent: 'cyan' },
  { label: 'DOM', accent: 'emerald' },
];

const CAPTIONS: string[] = [
  'Event captured on <button>',
  'setCount schedules an update',
  'React calls App() again',
  'New tree committed',
  'DOM patched with new count',
];

const STEP_MS = 380;
const HOLD_MS = 2200;
const RESET_DELAY_MS = 1600;

const TIMES: number[] = NODES.map((_, i) => i / (NODES.length - 1));

const MICRO_LABEL =
  'text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold';

const TRACE_BUTTON =
  'flex h-8 items-center gap-1 rounded-lg border border-[#0284c7]/35 bg-[#0284c7]/10 px-3 py-1.5 text-xs font-medium text-[#0284c7] transition-all hover:bg-[#0284c7]/20 active:scale-95 dark:border-[#00F0FF]/30 dark:bg-[#00F0FF]/10 dark:text-[#7DEBFF] dark:hover:bg-[#00F0FF]/20 dark:hover:shadow-[0_0_18px_rgba(0,240,255,0.25)]';

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

interface PulseState {
  id: number;
  centers: number[];
}

export default function StateFlowVisualizer({ className }: { className?: string }) {
  const [count, setCount] = useState<number>(3);
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [pulse, setPulse] = useState<PulseState | null>(null);

  const flowRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => clearTimeout(t));
    };
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  const triggerFlow = () => {
    clearTimers();
    const container = flowRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    const centers: number[] = [];
    for (const el of nodeRefs.current) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      centers.push(rect.left - bounds.left + rect.width / 2);
    }

    setPulse({ id: Date.now(), centers });

    NODES.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setActivePhase(i), i * STEP_MS),
      );
    });
    timers.current.push(
      setTimeout(() => setActivePhase(null), HOLD_MS + RESET_DELAY_MS),
    );
  };

  const bump = (delta: number) => {
    setCount((c) => c + delta);
    triggerFlow();
  };

  const travelSeconds = ((NODES.length - 1) * STEP_MS) / 1000;
  const holdPoint = travelSeconds / (HOLD_MS / 1000);
  const validPulse = pulse !== null && pulse.centers.length === NODES.length;

  return (
    <div
      className={cx(
        'rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-none',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00F0FF]/25 bg-[#00F0FF]/10">
            <Workflow size={16} className="text-[#0284c7] dark:text-[#00F0FF]" />
          </div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            How a state update flows
          </h3>
        </div>
        <span className={MICRO_LABEL}>Interactive</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="flex h-14 min-w-[76px] items-center justify-center rounded-xl border border-slate-200 bg-slate-900 px-4 dark:border-white/[0.08] dark:bg-black/30">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={count}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="text-3xl font-mono text-[#00F0FF]"
              style={{ textShadow: '0 0 18px rgba(0,240,255,0.45)' }}
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => bump(-1)}
            className={TRACE_BUTTON}
            aria-label="Decrement count"
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            onClick={() => bump(1)}
            className={TRACE_BUTTON}
            aria-label="Increment count"
          >
            <Plus size={14} />
          </button>
        </div>
        <span className="ml-auto hidden font-mono text-[11px] text-slate-500 sm:block">
          {'// click to trace the flow'}
        </span>
      </div>

      <div className="mt-5">
        <div ref={flowRef} className="relative">
          <div className="flex items-center overflow-x-clip py-1">
            {NODES.map((node, i) => {
              const accent = ACCENTS[node.accent];
              const active = activePhase === i;
              return (
                <Fragment key={node.label}>
                  {i > 0 && (
                    <div className="h-px min-w-[10px] flex-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-white/[0.05] dark:via-white/[0.14] dark:to-white/[0.05]" />
                  )}
                  <motion.div
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    animate={{ scale: active ? 1.05 : 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                    className={cx(
                      'relative z-10 shrink-0 rounded-xl border px-2 py-2 font-mono text-[11px] whitespace-nowrap transition-[border-color,background-color,color,box-shadow] duration-300',
                      active
                        ? cx(accent.border, accent.bg, accent.text, accent.shadow)
                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-slate-400',
                    )}
                  >
                    {node.label}
                  </motion.div>
                </Fragment>
              );
            })}
          </div>

          {validPulse && pulse && (
            <motion.div
              key={pulse.id}
              className="pointer-events-none absolute left-0 top-1/2 z-20 h-2 w-2 rounded-full bg-[#7DEBFF]"
              style={{
                x: '-50%',
                y: '-50%',
                boxShadow:
                  '0 0 10px rgba(125,235,255,0.9), 0 0 26px rgba(0,240,255,0.45)',
              }}
              initial={{ left: pulse.centers[0], opacity: 1 }}
              animate={{ left: pulse.centers, opacity: [1, 1, 0] }}
              transition={{
                left: {
                  duration: travelSeconds,
                  times: TIMES,
                  ease: 'easeInOut',
                },
                opacity: {
                  duration: HOLD_MS / 1000,
                  times: [0, holdPoint, 1],
                  ease: 'linear',
                },
              }}
            />
          )}
        </div>

        <div className="mt-4 flex h-5 items-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {activePhase === null || !validPulse ? (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="font-mono text-[11px] text-slate-500"
              >
                Trigger +1 or -1 to trace the update path
              </motion.span>
            ) : (
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: ACCENTS[NODES[activePhase].accent].dot,
                    boxShadow: `0 0 8px ${ACCENTS[NODES[activePhase].accent].dot}`,
                  }}
                />
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {CAPTIONS[activePhase]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
