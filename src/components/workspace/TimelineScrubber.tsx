'use client';

import { useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Gauge,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Zap,
} from 'lucide-react';
import {
  AUTHORED_LESSONS,
  formatTime,
  generateWaveform,
  getChapterAtTime,
  getStepAtTime,
} from '@/lib/academy/authored-content';
import { useAcademy } from '@/lib/academy/store';

const BARS = 168;

export default function TimelineScrubber() {
  const activeSampleId = useAcademy((s) => s.activeSampleId);
  const isPlaying = useAcademy((s) => s.isPlaying);
  const currentTime = useAcademy((s) => s.currentTime);
  const speed = useAcademy((s) => s.speed);
  const hijacked = useAcademy((s) => s.hijacked);
  const togglePlay = useAcademy((s) => s.togglePlay);
  const seek = useAcademy((s) => s.seek);
  const cycleSpeed = useAcademy((s) => s.cycleSpeed);
  const play = useAcademy((s) => s.play);

  const sample = AUTHORED_LESSONS[activeSampleId] ?? AUTHORED_LESSONS['06.01.01'];

  const barRefs = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const bars = useMemo(() => generateWaveform(sample, BARS), [sample]);
  const progress = currentTime / sample.duration;
  const step = getStepAtTime(sample, currentTime);
  const chapter = getChapterAtTime(sample, currentTime);

  const seekFromEvent = useCallback(
    (clientX: number) => {
      const el = barRefs.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      seek(ratio * sample.duration);
    },
    [seek, sample.duration]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
    seekFromEvent(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (draggingRef.current) seekFromEvent(e.clientX);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  const chapterColorFor = (barIdx: number) => {
    const t = (barIdx / BARS) * sample.duration;
    return getChapterAtTime(sample, t).color;
  };

  return (
    <section
      aria-label="Lesson timeline"
      className="relative shrink-0 border-t border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/[0.07] dark:bg-black/45"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-px hidden h-px bg-gradient-to-r from-transparent via-[#00F0FF]/40 to-transparent dark:block" />

      <div className="space-y-2 px-3 py-2.5 sm:px-4">
        <div className="flex min-h-6 items-center gap-2 text-[11px]">
          <span
            className="shrink-0 rounded-md border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
            style={{
              borderColor: `${chapter.color}55`,
              color: chapter.color,
              background: `${chapter.color}14`,
            }}
          >
            {chapter.label}
          </span>
          <motion.span
            key={step.id}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="min-w-0 flex-1 truncate text-slate-600 dark:text-slate-400"
          >
            {step.copy}
          </motion.span>

          {hijacked && (
            <span className="hidden items-center gap-1 rounded-md border border-amber-400/35 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 sm:flex dark:text-amber-200">
              <Zap className="h-3 w-3" />
              Manual edit
            </span>
          )}

          <span className="shrink-0 font-mono text-[10px] tabular-nums text-slate-500">
            <span className="font-semibold text-[#0284c7] dark:text-[#7DEBFF]">
              {formatTime(currentTime)}
            </span>
            {' / '}
            {formatTime(sample.duration)}
          </span>
        </div>

        {/* Waveform */}
        <div
          ref={barRefs}
          role="slider"
          aria-label="Seek lesson timeline"
          aria-valuemin={0}
          aria-valuemax={sample.duration}
          aria-valuenow={Math.round(currentTime)}
          aria-valuetext={`${formatTime(currentTime)} — ${step.title}`}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="group relative flex h-10 cursor-pointer touch-none items-end gap-px"
        >
          {bars.map((v, i) => {
            const barT = (i / BARS) * sample.duration;
            const played = barT <= currentTime;
            const color = chapterColorFor(i);
            return (
              <div
                key={i}
                className="flex-1 rounded-[1px] transition-[height,background-color] duration-150"
                style={{
                  height: `${Math.max(12, v * 100)}%`,
                  background: played ? color : 'rgba(148,163,184,0.22)',
                  opacity: played ? 0.95 : 1,
                }}
              />
            );
          })}

          {sample.chapters.slice(1).map((c) => (
            <div
              key={c.t}
              className="pointer-events-none absolute -top-0.5 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border border-slate-400 bg-white dark:border-white/40 dark:bg-[#0B0D14]"
              style={{ left: `${(c.t / sample.duration) * 100}%` }}
              title={c.label}
            />
          ))}

          <div
            className="pointer-events-none absolute -top-1 bottom-[-2px]"
            style={{ left: `${progress * 100}%` }}
          >
            <div
              className={`h-[calc(100%+6px)] w-[2px] -translate-x-1/2 rounded-full ${isPlaying ? 'nl-playhead' : ''}`}
              style={{ background: '#00F0FF', boxShadow: '0 0 10px rgba(0,240,255,0.6)' }}
            />
            <div
              className="absolute -top-1 left-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-white bg-[#00F0FF] dark:border-[#0B0D14]"
              style={{ boxShadow: '0 0 12px rgba(0,240,255,0.8)' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause walkthrough' : 'Play walkthrough'}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#0284c7]/40 bg-[#0284c7]/15 text-[#0284c7] transition-all hover:bg-[#0284c7]/25 dark:border-[#00F0FF]/40 dark:bg-[#00F0FF]/15 dark:text-[#7DEBFF]"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => seek(currentTime - 5)}
            aria-label="Back 5 seconds"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-slate-200"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              seek(currentTime + 5);
              play();
            }}
            aria-label="Forward 5 seconds"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-slate-200"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={cycleSpeed}
            aria-label={`Playback speed ${speed}x`}
            className="flex h-7 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 font-mono text-[11px] font-semibold text-slate-700 transition-colors hover:border-[#0284c7]/40 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-[#00F0FF]/40"
          >
            <Gauge className="h-3 w-3" />
            {speed}x
          </button>

          <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-white/[0.07]" />

          <span className="hidden min-w-0 truncate text-[11px] text-slate-500 sm:block">
            <span className="font-medium text-slate-700 dark:text-slate-300">{step.title}</span>
            <span className="mx-1.5 text-slate-400 dark:text-slate-700">·</span>
            {sample.id}
          </span>

          <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400 md:inline dark:text-slate-600">
            Space play · [ / ] sample
          </span>
        </div>
      </div>
    </section>
  );
}
