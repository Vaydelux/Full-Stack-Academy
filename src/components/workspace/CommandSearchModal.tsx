'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, FileCode2, Search, X } from 'lucide-react';
import { AUTHORED_LESSONS, findAuthoredReference } from '@/lib/academy/authored-content';
import { lessons, references } from '@/lib/academy/curriculum';
import { useAcademy } from '@/lib/academy/store';

function SearchModalPanel({ onClose }: { onClose: () => void }) {
  const selectLesson = useAcademy((s) => s.selectLesson);
  const selectReference = useAcademy((s) => s.selectReference);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchedLessons = lessons
      .filter((l) =>
        !q
          ? Boolean(AUTHORED_LESSONS[l.id])
          : `${l.id} ${l.title} ${l.track} ${l.module}`.toLowerCase().includes(q)
      )
      .slice(0, 24);

    const matchedRefs = references
      .filter((r) =>
        !q
          ? Boolean(findAuthoredReference(r.category, r.title))
          : `${r.title} ${r.category} ${r.slug}`.toLowerCase().includes(q)
      )
      .slice(0, 16);

    return { matchedLessons, matchedRefs };
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      role="dialog"
      aria-modal="true"
      aria-label="Search academy"
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/[0.12] dark:bg-[#0D0F17]"
    >
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
        <Search className="h-4 w-4 text-[#0284c7] dark:text-[#00F0FF]" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
          }}
          placeholder="Search 889 planned lesson topics or 303 reference subjects..."
          aria-label="Global curriculum and reference search"
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto p-3">
        {!query.trim() && (
          <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Showing authored sample lessons &amp; references · Type to search all 889 topics &amp; 303 subjects
          </div>
        )}

        {results.matchedLessons.length > 0 && (
          <div className="mb-4">
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Curriculum topics ({results.matchedLessons.length})
            </div>
            <div className="space-y-1">
              {results.matchedLessons.map((l) => {
                const isAuthored = Boolean(AUTHORED_LESSONS[l.id]);
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      selectLesson(l.id);
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                  >
                    <FileCode2 className="h-4 w-4 shrink-0 text-[#0284c7] dark:text-[#00F0FF]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {l.id} · {l.title}
                      </div>
                      <div className="truncate text-[11px] text-slate-500">
                        {l.track} / {l.module}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        isAuthored
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-[#6EE7B7]'
                          : 'border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.04]'
                      }`}
                    >
                      {isAuthored ? 'Authored sample' : 'Planned'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {results.matchedRefs.length > 0 && (
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Reference encyclopedia ({results.matchedRefs.length})
            </div>
            <div className="space-y-1">
              {results.matchedRefs.map((r) => {
                const isAuthored = Boolean(findAuthoredReference(r.category, r.title));
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      selectReference(r.id);
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-[#6d28d9] dark:text-[#C9A0FF]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {r.title}
                      </div>
                      <div className="truncate text-[11px] text-slate-500">{r.category}</div>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        isAuthored
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-[#6EE7B7]'
                          : 'border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.04]'
                      }`}
                    >
                      {isAuthored ? 'Authored draft' : 'Indexed'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {results.matchedLessons.length === 0 && results.matchedRefs.length === 0 && (
          <p className="py-8 text-center text-xs text-slate-500">
            No matching topics or reference subjects found.
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function CommandSearchModal() {
  const open = useAcademy((s) => s.commandOpen);
  const setOpen = useAcademy((s) => s.setCommandOpen);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[85] flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-sm"
        >
          <SearchModalPanel onClose={() => setOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
