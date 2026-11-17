'use client';

import { useEffect, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eraser,
  StickyNote,
  Terminal,
} from 'lucide-react';
import { lessonMap } from '@/lib/academy/curriculum';
import { useAcademy } from '@/lib/academy/store';

export default function ConsoleNotesDrawer() {
  const drawerTab = useAcademy((s) => s.drawerTab);
  const setDrawerTab = useAcademy((s) => s.setDrawerTab);
  const drawerOpen = useAcademy((s) => s.drawerOpen);
  const toggleDrawer = useAcademy((s) => s.toggleDrawer);
  const drawerHeight = useAcademy((s) => s.drawerHeight);
  const setDrawerHeight = useAcademy((s) => s.setDrawerHeight);
  const consoleLogs = useAcademy((s) => s.consoleLogs);
  const clearConsole = useAcademy((s) => s.clearConsole);
  const consoleBadge = useAcademy((s) => s.consoleBadge);
  const selectedLessonId = useAcademy((s) => s.selectedLessonId);
  const progress = useAcademy((s) => s.progress);
  const setNote = useAcademy((s) => s.setNote);

  const dragRef = useRef(false);
  const currentLesson = lessonMap.get(selectedLessonId);
  const noteText = progress.notes[selectedLessonId] ?? '';

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragRef.current) return;
      setDrawerHeight(window.innerHeight - e.clientY - 56);
    };
    const up = () => {
      dragRef.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [setDrawerHeight]);

  const levelColor: Record<string, string> = {
    log: 'text-slate-700 dark:text-slate-300',
    info: 'text-[#0284c7] dark:text-[#7DEBFF]',
    warn: 'text-amber-600 dark:text-amber-300',
    error: 'text-rose-600 dark:text-rose-300',
  };
  const levelDot: Record<string, string> = {
    log: 'bg-slate-400 dark:bg-slate-500',
    info: 'bg-[#0284c7] dark:bg-[#00F0FF]',
    warn: 'bg-amber-400',
    error: 'bg-rose-500 dark:bg-rose-400',
  };

  return (
    <div
      className="relative flex shrink-0 flex-col border-t border-slate-200 bg-white/85 backdrop-blur-xl dark:border-white/[0.07] dark:bg-black/40"
      style={{ height: drawerOpen ? drawerHeight : 37 }}
    >
      {drawerOpen && (
        <div
          onPointerDown={() => {
            dragRef.current = true;
            document.body.style.cursor = 'ns-resize';
          }}
          className="absolute inset-x-0 -top-1 z-10 h-2 cursor-ns-resize"
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-slate-200 px-2 dark:border-white/[0.06]">
        <button
          type="button"
          onClick={() => setDrawerTab('console')}
          className={`relative flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
            drawerTab === 'console'
              ? 'bg-slate-100 text-slate-900 dark:bg-white/[0.07] dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          Console
          {consoleBadge > 0 && (
            <span className="flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-1 font-mono text-[8px] font-bold text-white">
              {consoleBadge}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setDrawerTab('notes')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
            drawerTab === 'notes'
              ? 'bg-slate-100 text-slate-900 dark:bg-white/[0.07] dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <StickyNote className="h-3.5 w-3.5 text-[#6d28d9] dark:text-[#C9A0FF]" />
          Private Notes
        </button>

        <div className="ml-auto flex items-center gap-1">
          {drawerTab === 'console' && (
            <button
              type="button"
              onClick={clearConsole}
              title="Clear console"
              className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
            >
              <Eraser className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleDrawer}
            aria-label={drawerOpen ? 'Collapse drawer' : 'Expand drawer'}
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
          >
            {drawerOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Body */}
      {drawerOpen && (
        <>
          {drawerTab === 'console' ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2" aria-label="Sandbox console output">
              {consoleLogs.length === 0 ? (
                <div className="flex h-full min-h-16 flex-col items-center justify-center gap-1.5 text-center">
                  <Terminal className="h-4 w-4 text-slate-400 dark:text-slate-600" />
                  <p className="text-[11px] text-slate-500">
                    Sandbox and simulator output appears here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {consoleLogs.map((e) => (
                    <li key={e.id} className="flex items-start gap-2 font-mono text-[11px] leading-relaxed">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${levelDot[e.level]}`} />
                      <span className="shrink-0 text-slate-400 dark:text-slate-600">{e.time}</span>
                      <span className={`min-w-0 break-words ${levelColor[e.level]}`}>{e.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                <span className="truncate">
                  {selectedLessonId} · {currentLesson?.title ?? 'Lesson note'}
                </span>
                <span className="shrink-0 text-emerald-600 dark:text-[#6EE7B7]">
                  Saved locally
                </span>
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNote(selectedLessonId, e.target.value)}
                placeholder="Write what clicked, what broke, or what to revisit before shipping..."
                aria-label="Private note for current topic"
                className="min-h-0 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-800 outline-none focus:border-[#8A2BE2]/50 dark:border-white/[0.08] dark:bg-black/30 dark:text-slate-200"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Stored only in this browser. Export via Backup.</span>
                <span>Shortcuts: / search · [ / ] samples</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

