'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenText, CheckCircle2, Code2, Info, Menu, MonitorPlay, StickyNote, TriangleAlert } from 'lucide-react';
import { AUTHORED_LESSONS, AUTHORED_LESSON_IDS } from '@/lib/academy/authored-content';
import { useAcademy } from '@/lib/academy/store';
import CodeEditor from './CodeEditor';
import CommandSearchModal from './CommandSearchModal';
import ConsoleNotesDrawer from './ConsoleNotesDrawer';
import DocsPane from './DocsPane';
import PreviewPane from './PreviewPane';
import SyllabusPanel from './SyllabusPanel';
import TimelineScrubber from './TimelineScrubber';
import TopBar from './TopBar';

function ToastLayer() {
  const toast = useAcademy((s) => s.toast);
  const dismiss = useAcademy((s) => s.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dismiss(toast.id), 2800);
    return () => clearTimeout(t);
  }, [toast, dismiss]);

  const icon =
    toast?.tone === 'success' ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    ) : toast?.tone === 'error' ? (
      <TriangleAlert className="h-4 w-4 text-rose-400" />
    ) : (
      <Info className="h-4 w-4 text-[#00F0FF]" />
    );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 text-[12px] font-medium text-slate-800 shadow-xl backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#0D0F17]/95 dark:text-slate-200"
          >
            {icon}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function Workspace() {
  const [mobileNav, setMobileNav] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const hydrate = useAcademy((s) => s.hydrate);
  const theme = useAcademy((s) => s.progress.theme);
  const mobileTab = useAcademy((s) => s.mobileTab);
  const setMobileTab = useAcademy((s) => s.setMobileTab);
  const activeView = useAcademy((s) => s.activeView);
  const lessonId = useAcademy((s) => s.selectedLessonId);
  const note = useAcademy((s) => s.progress.notes[lessonId] ?? '');
  const setNote = useAcademy((s) => s.setNote);
  const pause = useAcademy((s) => s.pause);
  const canPractice = activeView === 'lesson' && Boolean(AUTHORED_LESSONS[lessonId]);
  const practicing = canPractice && mobileTab !== 'docs';

  useEffect(() => {
    hydrate();
    // Deep-link a documentation article into its corresponding interactive lesson.
    // Store selection still validates against the canonical curriculum catalog.
    const deepLink = new URLSearchParams(window.location.search).get('lesson');
    if (deepLink) useAcademy.getState().selectLesson(deepLink);
    if (deepLink && new URLSearchParams(window.location.search).get('mode') === 'practice' && AUTHORED_LESSONS[deepLink]) useAcademy.getState().setMobileTab('editor');
  }, [hydrate]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const s = useAcademy.getState();
      if (s.isPlaying) s.tick(0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        useAcademy.getState().setCommandOpen(true);
        return;
      }
      const target = e.target as HTMLElement | null;
      // Preserve keyboard activation and navigation inside interactive widgets.
      if (
        e.altKey || e.metaKey || e.ctrlKey ||
        target?.closest('input, textarea, select, button, a, [contenteditable], [role="dialog"], [role="slider"], [role="listbox"], [role="combobox"]')
      ) {
        return;
      }
      const s = useAcademy.getState();
      if (e.key === '/') {
        e.preventDefault();
        s.setCommandOpen(true);
      } else if (e.key === ']') {
        e.preventDefault();
        const idx = AUTHORED_LESSON_IDS.indexOf(
          s.selectedLessonId as (typeof AUTHORED_LESSON_IDS)[number]
        );
        s.selectLesson(AUTHORED_LESSON_IDS[(Math.max(0, idx) + 1) % AUTHORED_LESSON_IDS.length]);
      } else if (e.key === '[') {
        e.preventDefault();
        const idx = AUTHORED_LESSON_IDS.indexOf(
          s.selectedLessonId as (typeof AUTHORED_LESSON_IDS)[number]
        );
        s.selectLesson(
          AUTHORED_LESSON_IDS[
            (Math.max(0, idx) + AUTHORED_LESSON_IDS.length - 1) % AUTHORED_LESSON_IDS.length
          ]
        );
      } else if (e.code === 'Space' && s.mobileTab !== 'docs') {
        e.preventDefault();
        s.togglePlay();
      } else if (e.key === 'ArrowLeft' && s.mobileTab !== 'docs') {
        s.seek(s.currentTime - 5);
      } else if (e.key === 'ArrowRight' && s.mobileTab !== 'docs') {
        s.seek(s.currentTime + 5);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);


  return (
    <div className="academy-shell flex h-dvh flex-col bg-slate-50 dark:bg-[#101116]">
      <TopBar />
      <CommandSearchModal />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-2 lg:hidden dark:border-white/10 dark:bg-[#15161c]">
          <button type="button" aria-expanded={mobileNav} aria-controls="academy-navigation" onClick={() => setMobileNav(v => !v)}
            className="flex min-h-9 items-center gap-2 text-sm font-semibold">
            <Menu size={17} aria-hidden="true" /> Curriculum
          </button>
          <Link href="/reference" className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Reference library</Link>
        </div>
        <aside id="academy-navigation" className={`${mobileNav ? 'flex' : 'hidden'} max-h-[42dvh] min-h-0 shrink-0 flex-col overflow-hidden border-b border-slate-200 bg-white lg:flex lg:h-full lg:max-h-none lg:w-[300px] lg:border-b-0 lg:border-r dark:border-white/10 dark:bg-[#15161c]`}>
          <SyllabusPanel fullHeight />
        </aside>
        <main id="academy-main" className="flex min-h-0 min-w-0 flex-1 flex-col">
          {canPractice && (
            <nav aria-label="Learning mode" className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-[#15161c]">
              <button type="button" aria-pressed={!practicing} onClick={() => { pause(); setMobileTab('docs'); }}
                className={`flex min-h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${!practicing ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white' : 'text-slate-500'}`}>
                <BookOpenText size={16} aria-hidden="true" /> Read lesson
              </button>
              <button type="button" aria-pressed={practicing} onClick={() => { setMobileNav(false); setMobileTab('editor'); }}
                className={`flex min-h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${practicing ? 'bg-cyan-700 text-white dark:bg-cyan-300 dark:text-slate-950' : 'text-cyan-700 dark:text-cyan-300'}`}>
                <Code2 size={16} aria-hidden="true" /> Practice
              </button>
              <button type="button" aria-expanded={notesOpen} onClick={() => setNotesOpen(v => !v)}
                className="ml-auto flex min-h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10">
                <StickyNote size={16} aria-hidden="true" /> Notes
              </button>
              <Link href={`/learn/${lessonId}`} className="hidden text-xs font-medium text-slate-500 hover:underline sm:inline">Full article</Link>
            </nav>
          )}
          {notesOpen && canPractice && (
            <section aria-label="Private lesson notes" className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#15161c]">
              <label htmlFor="reading-note" className="text-xs font-semibold text-slate-500">Private notes · saved in this browser</label>
              <textarea id="reading-note" value={note} onChange={e => setNote(lessonId, e.target.value)} rows={3} maxLength={20000}
                className="mt-2 block w-full resize-y rounded-lg border border-slate-300 bg-transparent p-3 text-sm dark:border-white/15" />
            </section>
          )}
          <div className={`min-h-0 flex-1 flex-col ${practicing ? 'hidden' : 'flex'}`}>
            <DocsPane />
          </div>
          {practicing && (
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <nav aria-label="Practice panes" className="flex shrink-0 border-b border-slate-200 bg-white lg:hidden dark:border-white/10 dark:bg-[#15161c]">
                <button type="button" aria-pressed={mobileTab === 'editor'} onClick={() => setMobileTab('editor')} className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium"><Code2 size={15} /> Code</button>
                <button type="button" aria-pressed={mobileTab === 'output'} onClick={() => setMobileTab('output')} className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium"><MonitorPlay size={15} /> Output</button>
              </nav>
              <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 lg:grid-cols-2">
                <div className={`min-h-0 min-w-0 flex-col ${mobileTab === 'editor' ? 'flex' : 'hidden'} lg:flex`}>
                  <CodeEditor />
                  <TimelineScrubber />
                </div>
                <div className={`min-h-0 min-w-0 flex-col border-slate-200 lg:border-l dark:border-white/10 ${mobileTab === 'output' ? 'flex' : 'hidden'} lg:flex`}>
                  <PreviewPane />
                  <ConsoleNotesDrawer />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <ToastLayer />
    </div>
  );
}
