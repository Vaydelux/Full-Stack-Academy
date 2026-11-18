'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Copy,
  FileCode2,
  PencilLine,
  RotateCcw,
  Undo2,
  Zap,
} from 'lucide-react';
import {
  AUTHORED_LESSONS,
  getStepAtTime,
} from '@/lib/academy/authored-content';
import { countLines, tokenize } from '@/lib/academy/highlight';
import { useAcademy } from '@/lib/academy/store';

const SHARED_FONT =
  'font-mono text-[13px] leading-5 whitespace-pre tracking-normal';

export default function CodeEditor() {
  const activeSampleId = useAcademy((s) => s.activeSampleId);
  const selectedLessonId = useAcademy((s) => s.selectedLessonId);
  const code = useAcademy((s) => s.code);
  const hijacked = useAcademy((s) => s.hijacked);
  const isPlaying = useAcademy((s) => s.isPlaying);
  const pulse = useAcademy((s) => s.pulse);
  const selectedLine = useAcademy((s) => s.selectedLine);
  const previewError = useAcademy((s) => s.previewError);
  const currentTime = useAcademy((s) => s.currentTime);
  const setCodeByUser = useAcademy((s) => s.setCodeByUser);
  const syncToLesson = useAcademy((s) => s.syncToLesson);
  const applyStep = useAcademy((s) => s.applyStep);
  const setSelectedLine = useAcademy((s) => s.setSelectedLine);
  const setCursor = useAcademy((s) => s.setCursor);
  const showToast = useAcademy((s) => s.showToast);

  const sample = AUTHORED_LESSONS[activeSampleId] ?? AUTHORED_LESSONS['06.01.01'];

  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const tokens = useMemo(() => tokenize(code), [code]);
  const lineCount = useMemo(() => countLines(code), [code]);
  const activeStep = useMemo(() => getStepAtTime(sample, currentTime), [sample, currentTime]);

  const errorLine = useMemo(() => {
    if (!previewError) return null;
    const m = previewError.match(/\((\d+):(\d+)\)/);
    return m ? parseInt(m[1], 10) : null;
  }, [previewError]);

  useEffect(() => {
    const ta = taRef.current;
    if (ta && ta.value !== code) ta.value = code;
  }, [code]);

  const syncScroll = () => {
    const ta = taRef.current;
    if (!ta) return;
    if (preRef.current) {
      preRef.current.scrollTop = ta.scrollTop;
      preRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
  };

  const updateCursor = () => {
    const ta = taRef.current;
    if (!ta) return;
    const upto = ta.value.slice(0, ta.selectionStart);
    const lines = upto.split('\n');
    setCursor({ ln: lines.length, col: lines[lines.length - 1].length + 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = taRef.current;
    if (!ta) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = ta;
      ta.setRangeText('  ', selectionStart, selectionEnd, 'end');
      setCodeByUser(ta.value);
      updateCursor();
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(code);
      showToast('Code copied to clipboard', 'success');
    } catch {
      showToast('Clipboard unavailable', 'error');
    }
  };

  const gutterWidth =
    lineCount >= 100 ? 'w-14' : lineCount >= 10 ? 'w-11' : 'w-9';

  if (!AUTHORED_LESSONS[selectedLessonId]) {
    return (
      <section role="status" className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-[#0B0D14] p-6 text-center">
        <FileCode2 className="h-7 w-7 text-slate-500" aria-hidden="true" />
        <h2 className="text-sm font-bold text-slate-200">No lab code for this topic yet</h2>
        <p className="max-w-sm text-xs leading-relaxed text-slate-400">This lesson is planned, not published. The editor will become available when its exercises and expected output have been verified.</p>
      </section>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#0B0D14]">
      {/* Header */}
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.08] bg-black/40 px-2.5">
        <div className="flex h-full items-center gap-2 border-t-2 border-[#00F0FF]/70 bg-white/[0.04] px-3 text-[11px] font-medium text-slate-200">
          <FileCode2 className="h-3.5 w-3.5 text-[#00F0FF]" />
          <span className="truncate">{hijacked ? 'Sandbox.tsx' : activeStep.file}</span>
          {hijacked && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.8)]" />
          )}
        </div>

        <AnimatePresence>
          {isPlaying && !hijacked && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="hidden items-center gap-1.5 rounded-md border border-[#00F0FF]/25 bg-[#00F0FF]/[0.07] px-2 py-1 text-[10px] font-semibold text-[#7DEBFF] sm:flex"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-[#00F0FF] opacity-60" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF]" />
              </span>
              Lesson playing
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hijacked && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="hidden items-center gap-1.5 rounded-md border border-amber-300/25 bg-amber-300/[0.07] px-2 py-1 text-[10px] font-semibold text-amber-200 sm:flex"
            >
              <Zap className="h-3 w-3" />
              Editing locally
            </motion.div>
          )}
        </AnimatePresence>

        <div className="ml-auto flex items-center gap-1">
          {hijacked && (
            <button
              type="button"
              onClick={syncToLesson}
              className="flex items-center gap-1.5 rounded-md border border-[#10B981]/30 bg-[#10B981]/10 px-2.5 py-1 text-[10px] font-semibold text-[#6EE7B7] transition-all hover:bg-[#10B981]/20 active:scale-95"
            >
              <Undo2 className="h-3 w-3" />
              Sync to step
            </button>
          )}
          <button
            type="button"
            onClick={() => applyStep(activeStep.id)}
            title="Reset editor to current step code"
            className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] p-1 text-slate-400 transition-colors hover:border-white/20 hover:text-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={copyAll}
            title="Copy code"
            className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] p-1 text-slate-400 transition-colors hover:border-white/20 hover:text-slate-200"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Editor surface */}
      <div className="relative flex min-h-0 flex-1 bg-[#0B0D14]">
        <div
          ref={gutterRef}
          className={`shrink-0 select-none overflow-hidden border-r border-white/[0.06] bg-black/25 pt-3 text-right ${gutterWidth}`}
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }, (_, i) => {
            const n = i + 1;
            const isSelected = selectedLine === n;
            const isError = errorLine === n;
            return (
              <button
                key={n}
                type="button"
                tabIndex={-1}
                onClick={() => setSelectedLine(isSelected ? null : n)}
                title={`Highlight line ${n}`}
                className={`block w-full pr-2.5 font-mono text-[13px] leading-5 transition-colors ${
                  isError
                    ? 'text-rose-400'
                    : isSelected
                      ? 'text-[#00F0FF] text-glow-cyan'
                      : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-0 flex-1">
          <pre
            ref={preRef}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 m-0 overflow-hidden p-3 px-4 ${SHARED_FONT}`}
          >
            <div className="relative">
              {!hijacked &&
                (activeStep.highlightLines ?? []).map((ln) => (
                  <div
                    key={`hl-${ln}`}
                    className="absolute left-0 right-0 h-5 border-l-2 border-[#00F0FF]/50 bg-[#00F0FF]/[0.05]"
                    style={{ top: (ln - 1) * 20 }}
                  />
                ))}

              {selectedLine && (
                <div
                  className="absolute left-0 right-0 h-5 border-y border-[#8A2BE2]/30 bg-[#8A2BE2]/[0.08]"
                  style={{ top: (selectedLine - 1) * 20 }}
                />
              )}

              {errorLine && (
                <div
                  className="absolute left-0 right-0 h-5 border-b border-dashed border-rose-400/50 bg-rose-500/[0.07]"
                  style={{ top: (errorLine - 1) * 20 }}
                />
              )}

              {pulse &&
                pulse.lines.map((ln) => (
                  <div
                    key={`pulse-${pulse.key}-${ln}`}
                    className="nl-linepulse absolute left-0 right-0 h-5"
                    style={{ top: (ln - 1) * 20 }}
                  />
                ))}

              <code className="relative">
                {tokens.map((t, i) => (
                  <span key={i} className={t.cls}>
                    {t.text}
                  </span>
                ))}
                {'\n '}
              </code>
            </div>
          </pre>

          <textarea
            ref={taRef}
            defaultValue={code}
            onChange={(e) => {
              setCodeByUser(e.target.value);
              updateCursor();
            }}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            onSelect={updateCursor}
            onClick={updateCursor}
            spellCheck={false}
            wrap="off"
            aria-label="Interactive code editor"
            className={`nl-code-caret absolute inset-0 h-full w-full resize-none overflow-auto border-0 bg-transparent p-3 px-4 text-transparent outline-none ${SHARED_FONT}`}
          />
        </div>

        <AnimatePresence>
          {selectedLine && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-[#8A2BE2]/40 bg-[#0D0F17]/95 px-3 py-1.5 text-[11px] text-slate-300 shadow-lg backdrop-blur-xl"
            >
              <PencilLine className="h-3.5 w-3.5 text-[#C9A0FF]" />
              Line {selectedLine} highlighted
              <button
                type="button"
                onClick={() => setSelectedLine(null)}
                className="ml-1 text-slate-500 transition-colors hover:text-slate-200"
                aria-label="Clear line highlight"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {previewError && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden border-t border-rose-400/25 bg-rose-500/[0.09]"
          >
            <div className="flex items-start gap-2 px-3 py-2 text-[11px] leading-relaxed text-rose-200">
              <span className="mt-0.5 rounded bg-rose-400/20 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-rose-300">
                Error
              </span>
              <span className="font-mono">{previewError}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
