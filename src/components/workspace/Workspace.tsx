'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import {
  BookOpenText,
  CheckCircle2,
  Code2,
  Info,
  MonitorPlay,
  TriangleAlert,
} from 'lucide-react';
import {
  AUTHORED_LESSONS,
  AUTHORED_LESSON_IDS,
} from '@/lib/academy/authored-content';
import { summary } from '@/lib/academy/curriculum';
import { useAcademy } from '@/lib/academy/store';
import AmbientBackground from './AmbientBackground';
import BootSplash from './BootSplash';
import CodeEditor from './CodeEditor';
import CommandSearchModal from './CommandSearchModal';
import ConsoleNotesDrawer from './ConsoleNotesDrawer';
import DocsPane from './DocsPane';
import PreviewPane from './PreviewPane';
import SyllabusPanel from './SyllabusPanel';
import TimelineScrubber from './TimelineScrubber';
import TopBar from './TopBar';

function Handle() {
  return (
    <PanelResizeHandle className="group relative w-px bg-slate-200 transition-colors data-[resize-handle-state=drag]:bg-[#00F0FF]/70 data-[resize-handle-state=hover]:bg-[#00F0FF]/50 dark:bg-white/[0.07]">
      <div className="absolute inset-y-0 -left-1 -right-1" />
      <div className="absolute left-1/2 top-1/2 flex h-8 w-[5px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
        <span className="h-1 w-1 rounded-full bg-[#00F0FF]" />
        <span className="h-1 w-1 rounded-full bg-[#00F0FF]" />
      </div>
    </PanelResizeHandle>
  );
}

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

function StatusBar() {
  const activeSampleId = useAcademy((s) => s.activeSampleId);
  const previewStatus = useAcademy((s) => s.previewStatus);
  const previewError = useAcademy((s) => s.previewError);
  const cursor = useAcademy((s) => s.cursor);
  const hijacked = useAcademy((s) => s.hijacked);
  const isPlaying = useAcademy((s) => s.isPlaying);
  const speed = useAcademy((s) => s.speed);

  const sample = AUTHORED_LESSONS[activeSampleId] ?? AUTHORED_LESSONS['06.01.01'];

  const statusText =
    sample.sandboxMode !== 'react-live'
      ? `Interactive ${sample.sandboxMode === 'zod-live' ? 'Zod 4 validator' : 'concept simulator'} ready`
      : previewStatus === 'ready'
        ? 'React JSX sandbox ready'
        : previewStatus === 'error'
          ? previewError
            ? `Sandbox error — ${previewError.slice(0, 64)}`
            : 'Sandbox error'
          : 'Booting sandbox...';

  return (
    <footer className="relative z-20 flex h-7 shrink-0 items-center gap-3 border-t border-slate-200 bg-white/85 px-3 font-mono text-[10px] text-slate-500 backdrop-blur-xl dark:border-white/[0.06] dark:bg-black/50">
      <span className="flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            previewStatus === 'ready' || sample.sandboxMode !== 'react-live'
              ? 'bg-emerald-500'
              : previewStatus === 'error'
                ? 'bg-rose-400'
                : 'bg-amber-300 animate-pulse'
          }`}
        />
        <span className={`truncate ${previewStatus === 'error' ? 'text-rose-500 dark:text-rose-300' : ''}`}>
          {statusText}
        </span>
      </span>
      <span className="hidden text-slate-300 sm:inline dark:text-slate-700">|</span>
      <span className="hidden truncate sm:inline">
        {hijacked
          ? 'Manual edit mode'
          : isPlaying
            ? `Playing ${sample.id} at ${speed}x`
            : `${summary.tracks} tracks · ${summary.modules} modules · ${summary.plannedLessons} topics · ${summary.referenceSubjects} refs`}
      </span>
      <span className="ml-auto hidden items-center gap-3 md:flex">
        <span>
          Ln {cursor.ln}, Col {cursor.col}
        </span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="text-[#0284c7] dark:text-[#7DEBFF]">v1.1</span>
      </span>
    </footer>
  );
}

function MobileTabs() {
  const mobileTab = useAcademy((s) => s.mobileTab);
  const setMobileTab = useAcademy((s) => s.setMobileTab);
  const tabs = [
    { id: 'docs' as const, label: 'Docs & Catalog', icon: BookOpenText },
    { id: 'editor' as const, label: 'Editor', icon: Code2 },
    { id: 'output' as const, label: 'Output & Notes', icon: MonitorPlay },
  ];
  return (
    <nav
      aria-label="Workspace panes"
      className="relative z-20 flex shrink-0 border-t border-slate-200 bg-white/90 backdrop-blur-xl lg:hidden dark:border-white/[0.06] dark:bg-black/60"
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = mobileTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setMobileTab(t.id)}
            aria-pressed={active}
            className={`relative flex flex-1 items-center justify-center gap-1.5 py-2 text-[11px] font-medium transition-colors ${
              active ? 'text-[#0284c7] dark:text-[#7DEBFF]' : 'text-slate-500'
            }`}
          >
            <Icon className="h-4 w-4" />
            {t.label}
            {active && (
              <motion.span
                layoutId="mobile-tab-glow"
                className="absolute inset-x-6 top-0 h-px bg-[#00F0FF]"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default function Workspace() {
  const [booted, setBooted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const hydrate = useAcademy((s) => s.hydrate);
  const theme = useAcademy((s) => s.progress.theme);
  const mobileTab = useAcademy((s) => s.mobileTab);

  useEffect(() => {
    hydrate();
    const t = setTimeout(() => setBooted(true), 750);
    return () => clearTimeout(t);
  }, [hydrate]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

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
      } else if (e.code === 'Space') {
        e.preventDefault();
        s.togglePlay();
      } else if (e.key === 'ArrowLeft') {
        s.seek(s.currentTime - 5);
      } else if (e.key === 'ArrowRight') {
        s.seek(s.currentTime + 5);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!isDesktop) {
    return (
      <div className="academy-shell flex h-dvh flex-col">
        <AmbientBackground />
        <BootSplash done={booted} onSkip={() => setBooted(true)} />
        <TopBar />
        <CommandSearchModal />
        <main className="flex min-h-0 flex-1 flex-col">
          {mobileTab === 'docs' && (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <SyllabusPanel />
              <DocsPane />
            </div>
          )}
          {mobileTab === 'editor' && (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <CodeEditor />
              <TimelineScrubber />
            </div>
          )}
          {mobileTab === 'output' && (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <PreviewPane />
              <ConsoleNotesDrawer />
            </div>
          )}
        </main>
        <MobileTabs />
        <StatusBar />
        <ToastLayer />
      </div>
    );
  }

  return (
    <div className="academy-shell flex h-dvh flex-col">
      <AmbientBackground />
      <BootSplash done={booted} onSkip={() => setBooted(true)} />
      <TopBar />
      <CommandSearchModal />

      <main className="min-h-0 flex-1">
        <PanelGroup direction="horizontal" autoSaveId="academy-panes-v1" className="h-full">
          <Panel defaultSize={34} minSize={24} maxSize={48}>
            <div className="flex h-full flex-col overflow-hidden border-r border-slate-200 bg-white/50 dark:border-white/[0.06] dark:bg-white/[0.01]">
              <SyllabusPanel />
              <DocsPane />
            </div>
          </Panel>

          <Handle />

          <Panel defaultSize={36} minSize={24}>
            <div className="flex h-full flex-col overflow-hidden">
              <CodeEditor />
              <TimelineScrubber />
            </div>
          </Panel>

          <Handle />

          <Panel defaultSize={30} minSize={22} maxSize={45}>
            <div className="flex h-full flex-col overflow-hidden border-l border-slate-200 bg-white/50 dark:border-white/[0.06] dark:bg-white/[0.01]">
              <PreviewPane />
              <ConsoleNotesDrawer />
            </div>
          </Panel>
        </PanelGroup>
      </main>

      <StatusBar />
      <ToastLayer />
    </div>
  );
}
