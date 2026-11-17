'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Workflow } from 'lucide-react';
import type { MentalFlowStep } from '@/lib/academy/types';

const ACCENTS = {
  cyan: {
    border: 'border-[#00F0FF]/60',
    bg: 'bg-[#00F0FF]/12',
    text: 'text-[#0284c7] dark:text-[#7DEBFF]',
    shadow: 'shadow-[0_0_20px_rgba(0,240,255,0.22)]',
    dot: '#00F0FF',
  },
  violet: {
    border: 'border-[#8A2BE2]/60',
    bg: 'bg-[#8A2BE2]/12',
    text: 'text-[#6d28d9] dark:text-[#B388FF]',
    shadow: 'shadow-[0_0_20px_rgba(138,43,226,0.25)]',
    dot: '#B388FF',
  },
  emerald: {
    border: 'border-[#10B981]/60',
    bg: 'bg-[#10B981]/12',
    text: 'text-[#047857] dark:text-[#34D399]',
    shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.22)]',
    dot: '#34D399',
  },
} as const;

const STEP_MS = 450;

export default function PipelineVisualizer({
  title = 'Mental model flow',
  steps,
}: {
  title?: string;
  steps: MentalFlowStep[];
}) {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [pulse, setPulse] = useState<{ id: number; centers: number[] } | null>(null);
  const flowRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => clearTimeout(t));
  }, []);

  const triggerFlow = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];

    const container = flowRef.current;
    if (!container || steps.length < 2) return;
    const bounds = container.getBoundingClientRect();
    const centers: number[] = [];
    for (let i = 0; i < steps.length; i++) {
      const el = nodeRefs.current[i];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      centers.push(rect.left - bounds.left + rect.width / 2);
    }

    setPulse({ id: Date.now(), centers });
    steps.forEach((_, i) => {
      timers.current.push(setTimeout(() => setActivePhase(i), i * STEP_MS));
    });
    timers.current.push(
      setTimeout(() => setActivePhase(null), steps.length * STEP_MS + 1800)
    );
  };

  const times = steps.map((_, i) => (steps.length > 1 ? i / (steps.length - 1) : 0));
  const travelSeconds = Math.max(0.4, ((steps.length - 1) * STEP_MS) / 1000);
  const validPulse = pulse !== null && pulse.centers.length === steps.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00F0FF]/30 bg-[#00F0FF]/10">
            <Workflow size={16} className="text-[#0284c7] dark:text-[#00F0FF]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Interactive boundary trace
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={triggerFlow}
          className="flex items-center gap-1.5 rounded-lg border border-[#00F0FF]/35 bg-[#00F0FF]/10 px-3 py-1.5 text-xs font-semibold text-[#0284c7] transition-all hover:bg-[#00F0FF]/20 active:scale-95 dark:text-[#7DEBFF]"
        >
          <Play size={12} />
          Trace flow
        </button>
      </div>

      <div className="mt-5">
        <div ref={flowRef} className="relative">
          <div className="flex flex-wrap items-center gap-y-2 py-1 sm:flex-nowrap">
            {steps.map((node, i) => {
              const accent = ACCENTS[node.accent];
              const active = activePhase === i;
              return (
                <Fragment key={node.label}>
                  {i > 0 && (
                    <div className="hidden h-px min-w-[10px] flex-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 sm:block dark:from-white/[0.05] dark:via-white/[0.16] dark:to-white/[0.05]" />
                  )}
                  <motion.button
                    type="button"
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    onClick={() => setActivePhase(i)}
                    animate={{ scale: active ? 1.04 : 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                    className={`relative z-10 shrink-0 rounded-xl border px-2.5 py-2 font-mono text-[11px] whitespace-nowrap transition-all duration-300 ${
                      active
                        ? `${accent.border} ${accent.bg} ${accent.text} ${accent.shadow}`
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-slate-300'
                    }`}
                  >
                    {node.label}
                  </motion.button>
                </Fragment>
              );
            })}
          </div>

          {validPulse && pulse && (
            <motion.div
              key={pulse.id}
              className="pointer-events-none absolute left-0 top-1/2 z-20 hidden h-2 w-2 rounded-full bg-[#00F0FF] sm:block"
              style={{
                x: '-50%',
                y: '-50%',
                boxShadow: '0 0 10px rgba(0,240,255,0.9), 0 0 24px rgba(0,240,255,0.5)',
              }}
              initial={{ left: pulse.centers[0], opacity: 1 }}
              animate={{ left: pulse.centers, opacity: [1, 1, 0] }}
              transition={{
                left: { duration: travelSeconds, times, ease: 'easeInOut' },
                opacity: { duration: travelSeconds + 0.6, times: [0, 0.85, 1], ease: 'linear' },
              }}
            />
          )}
        </div>

        <div className="mt-4 flex min-h-6 items-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {activePhase === null ? (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="font-mono text-[11px] text-slate-500"
              >
                Click &ldquo;Trace flow&rdquo; or select any node to inspect its role
              </motion.span>
            ) : (
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-2"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: ACCENTS[steps[activePhase].accent].dot,
                    boxShadow: `0 0 8px ${ACCENTS[steps[activePhase].accent].dot}`,
                  }}
                />
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {steps[activePhase].caption}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

