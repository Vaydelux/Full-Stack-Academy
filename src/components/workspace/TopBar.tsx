'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { BookOpenText, Download, Ellipsis, Moon, Search, Sun, Upload } from 'lucide-react';
import { AUTHORED_LESSON_IDS } from '@/lib/academy/authored-content';
import { useAcademy } from '@/lib/academy/store';

export default function TopBar() {
  const progress = useAcademy(s => s.progress);
  const toggleTheme = useAcademy(s => s.toggleTheme);
  const setActiveView = useAcademy(s => s.setActiveView);
  const setCommandOpen = useAcademy(s => s.setCommandOpen);
  const exportBackupJson = useAcademy(s => s.exportBackupJson);
  const importBackupJson = useAcademy(s => s.importBackupJson);
  const showToast = useAcademy(s => s.showToast);
  const fileRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const done = AUTHORED_LESSON_IDS.filter(id => progress.complete[id]).length;
  const closeMenu = () => { if (menuRef.current) menuRef.current.open = false; };
  const backup = () => {
    const url = URL.createObjectURL(new Blob([exportBackupJson()], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'fullstack-academy-progress.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    closeMenu(); showToast('Progress backup downloaded', 'success');
  };
  const restore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2_000_000) { showToast('Backup exceeds 2 MB import limit', 'error'); return; }
      const result = importBackupJson(await file.text());
      if (!result.ok) showToast(result.error ?? 'Invalid backup', 'error');
    } catch { showToast('Unable to read backup file', 'error'); }
    finally { e.target.value = ''; }
  };
  const menuItem = 'flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10';
  return (
    <header className="relative z-40 flex min-h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-[#15161c]">
      <a href="#academy-main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:p-3 focus:text-slate-950">Skip to lesson</a>
      <button type="button" onClick={() => setActiveView('overview')} className="flex min-w-0 items-center gap-2 text-left">
        <BookOpenText className="shrink-0 text-cyan-700 dark:text-cyan-300" size={22} aria-hidden="true"/>
        <span className="truncate text-sm font-extrabold tracking-tight">Full-Stack Academy</span>
      </button>
      <nav aria-label="Main navigation" className="hidden items-center gap-5 pl-5 text-sm font-medium text-slate-600 sm:flex dark:text-slate-300">
        <Link href="/learn" className="hover:underline">Courses</Link>
        <Link href="/reference" className="hover:underline">Reference</Link>
      </nav>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <span className="hidden text-xs tabular-nums text-slate-500 md:inline" title="Completed authored samples">{done}/{AUTHORED_LESSON_IDS.length} complete</span>
        <button type="button" aria-label="Search curriculum and references" onClick={() => setCommandOpen(true)} className="flex min-h-10 items-center gap-2 rounded-lg px-2.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"><Search size={18}/><span className="hidden lg:inline">Search</span></button>
        <button type="button" aria-label="Toggle color theme" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">{progress.theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button>
        <details ref={menuRef} className="relative">
          <summary aria-label="More options" className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"><Ellipsis size={21}/></summary>
          <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-white/15 dark:bg-[#1b1d25]">
            <Link href="/learn" onClick={closeMenu} className={menuItem}>Course catalog</Link>
            <Link href="/reference" onClick={closeMenu} className={menuItem}>Reference library</Link>
            <button type="button" onClick={() => { setActiveView('arena'); closeMenu(); }} className={menuItem}>Bug Hunt Arena</button>
            <button type="button" onClick={() => { setActiveView('capstone'); closeMenu(); }} className={menuItem}>Capstone</button>
            <div className="my-1 border-t border-slate-200 dark:border-white/10"/>
            <button type="button" onClick={backup} className={menuItem}><Download size={15}/> Backup progress</button>
            <button type="button" onClick={() => { closeMenu(); fileRef.current?.click(); }} className={menuItem}><Upload size={15}/> Restore progress</button>
          </div>
        </details>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={restore}/>
      </div>
    </header>
  );
}
