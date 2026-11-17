'use client';

import { useRef } from 'react';
import {
  Bug,
  Compass,
  Download,
  Flag,
  Hexagon,
  Moon,
  Search,
  Sun,
  Upload,
} from 'lucide-react';
import { AUTHORED_LESSON_IDS } from '@/lib/academy/authored-content';
import { lessonMap, referenceMap } from '@/lib/academy/curriculum';
import { useAcademy } from '@/lib/academy/store';

export default function TopBar() {
  const activeView = useAcademy((s) => s.activeView);
  const selectedLessonId = useAcademy((s) => s.selectedLessonId);
  const selectedReferenceId = useAcademy((s) => s.selectedReferenceId);
  const progress = useAcademy((s) => s.progress);
  const setActiveView = useAcademy((s) => s.setActiveView);
  const setCommandOpen = useAcademy((s) => s.setCommandOpen);
  const toggleTheme = useAcademy((s) => s.toggleTheme);
  const exportBackupJson = useAcademy((s) => s.exportBackupJson);
  const importBackupJson = useAcademy((s) => s.importBackupJson);
  const showToast = useAcademy((s) => s.showToast);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const doneCount = AUTHORED_LESSON_IDS.filter((id) => progress.complete[id]).length;
  const currentLesson = lessonMap.get(selectedLessonId);
  const currentRef = referenceMap.get(selectedReferenceId);

  const breadcrumbTail =
    activeView === 'overview'
      ? 'Overview · v1.1'
      : activeView === 'arena'
        ? 'Bug Hunt Arena'
        : activeView === 'capstone'
          ? 'Capstone (13 Milestones)'
          : activeView === 'reference'
            ? `Reference / ${currentRef?.title ?? selectedReferenceId}`
            : currentLesson
              ? `${currentLesson.id} · ${currentLesson.title}`
              : 'Lesson';

  const handleBackup = () => {
    const json = exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fullstack-academy-progress.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    showToast('Progress backup downloaded', 'success');
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const res = importBackupJson(text);
    if (!res.ok) showToast(res.error ?? 'Invalid backup file', 'error');
    e.target.value = '';
  };

  return (
    <header className="relative z-30 flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/85 px-3 backdrop-blur-xl sm:px-4 dark:border-white/[0.06] dark:bg-black/45">
      {/* Brand */}
      <button
        type="button"
        onClick={() => setActiveView('overview')}
        className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
      >
        <div className="relative flex h-7 w-7 items-center justify-center">
          <Hexagon className="h-7 w-7 text-[#0284c7] dark:text-[#00F0FF]" strokeWidth={1.5} />
          <span className="absolute h-2 w-2 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#8A2BE2] shadow-[0_0_10px_rgba(0,240,255,0.75)]" />
        </div>
        <div className="leading-none">
          <div className="text-[12px] font-bold tracking-[0.18em] text-slate-900 dark:text-slate-100">
            FULL-STACK<span className="text-[#0284c7] dark:text-[#00F0FF] dark:text-glow-cyan">&nbsp;ACADEMY</span>
          </div>
          <div className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:block">
            Enterprise curriculum · v1.1
          </div>
        </div>
      </button>

      <div className="mx-1 hidden h-5 w-px bg-slate-200 md:block dark:bg-white/10" />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="hidden min-w-0 max-w-[260px] items-center gap-1.5 text-xs xl:flex">
        <span className="shrink-0 text-slate-500">v1.1</span>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <span className="truncate font-medium text-slate-700 dark:text-slate-300">{breadcrumbTail}</span>
      </nav>

      {/* Search trigger */}
      <div className="mx-auto hidden w-full max-w-xs md:block">
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="flex h-8 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500 transition-colors hover:border-[#0284c7]/40 hover:text-slate-800 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-[#00F0FF]/35 dark:hover:text-slate-200"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 truncate text-left">Search 889 topics or 303 references...</span>
          <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
            /
          </kbd>
        </button>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          aria-label="Search curriculum and references"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 md:hidden dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300"
        >
          <Search className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveView('overview')}
          className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors sm:flex ${
            activeView === 'overview'
              ? 'border-[#0284c7]/40 bg-[#0284c7]/10 text-[#0284c7] dark:border-[#00F0FF]/40 dark:bg-[#00F0FF]/12 dark:text-[#7DEBFF]'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/20'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveView('arena')}
          className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors sm:flex ${
            activeView === 'arena'
              ? 'border-[#8A2BE2]/50 bg-[#8A2BE2]/15 text-[#6d28d9] dark:text-[#C9A0FF]'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/20'
          }`}
        >
          <Bug className="h-3.5 w-3.5" />
          Bug Hunt
        </button>

        <button
          type="button"
          onClick={() => setActiveView('capstone')}
          className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors lg:flex ${
            activeView === 'capstone'
              ? 'border-[#10B981]/50 bg-[#10B981]/15 text-[#047857] dark:text-[#6EE7B7]'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/20'
          }`}
        >
          <Flag className="h-3.5 w-3.5" />
          Capstone
        </button>

        <span
          title="Only authored sample lessons can be completed"
          className="hidden items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] font-semibold text-emerald-700 xl:flex dark:text-[#6EE7B7]"
        >
          {doneCount}/{AUTHORED_LESSON_IDS.length} samples
        </span>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          title={`Switch to ${progress.theme === 'dark' ? 'light' : 'dark'} theme`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
        >
          {progress.theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        <button
          type="button"
          onClick={handleBackup}
          aria-label="Backup progress JSON"
          title="Export progress and notes as JSON"
          className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/20"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Backup</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Restore progress JSON"
          title="Restore progress and notes from JSON backup"
          className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/20"
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Restore</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleRestore}
        />
      </div>
    </header>
  );
}
