'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  FileCode2,
  Search,
  Sparkles,
  StickyNote,
} from 'lucide-react';
import {
  AUTHORED_LESSONS,
  AUTHORED_LESSON_IDS,
  findAuthoredReference,
} from '@/lib/academy/authored-content';
import {
  lessonMap,
  lessons,
  lessonsByModule,
  lessonsByTrack,
  modulesByTrack,
  references,
  summary,
  tracks,
} from '@/lib/academy/curriculum';
import { useAcademy } from '@/lib/academy/store';

/* ------------------------------------------------------------------ */
/* Progress ring (shared with DocsPane)                                */
/* ------------------------------------------------------------------ */

export function ProgressRing({
  percent,
  size = 30,
  stroke = 3,
  color = '#00F0FF',
  trackColor = 'rgba(148,163,184,0.2)',
  children,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (clamped / 100) * c }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Syllabus Panel                                                      */
/* ------------------------------------------------------------------ */

export default function SyllabusPanel({ fullHeight = false, onNavigate }: { fullHeight?: boolean; onNavigate?: () => void } = {}) {
  const open = useAcademy((s) => s.syllabusOpen);
  const toggle = useAcademy((s) => s.toggleSyllabus);
  const sidebarTab = useAcademy((s) => s.sidebarTab);
  const setSidebarTab = useAcademy((s) => s.setSidebarTab);
  const searchQuery = useAcademy((s) => s.searchQuery);
  const setSearchQuery = useAcademy((s) => s.setSearchQuery);
  const onlyAuthored = useAcademy((s) => s.onlyAuthored);
  const setOnlyAuthored = useAcademy((s) => s.setOnlyAuthored);
  const selectedLessonId = useAcademy((s) => s.selectedLessonId);
  const selectedReferenceId = useAcademy((s) => s.selectedReferenceId);
  const activeView = useAcademy((s) => s.activeView);
  const chooseLesson = useAcademy((s) => s.selectLesson);
  const chooseReference = useAcademy((s) => s.selectReference);
  const resume = useAcademy((s) => s.jumpToNextUnfinished);
  const selectLesson = (id: string) => { chooseLesson(id); onNavigate?.(); };
  const selectReference = (id: string) => { chooseReference(id); onNavigate?.(); };
  const jumpToNextUnfinished = () => { resume(); onNavigate?.(); };
  const progress = useAcademy((s) => s.progress);
  const expandedTrack = useAcademy((s) => s.expandedTrack);
  const setExpandedTrack = useAcademy((s) => s.setExpandedTrack);
  const expandedModule = useAcademy((s) => s.expandedModule);
  const setExpandedModule = useAcademy((s) => s.setExpandedModule);

  const doneCount = AUTHORED_LESSON_IDS.filter((id) => progress.complete[id]).length;
  const pct = Math.round((doneCount / AUTHORED_LESSON_IDS.length) * 100);

  const noteIds = useMemo(
    () => Object.keys(progress.notes).filter((id) => progress.notes[id]?.trim().length > 0),
    [progress.notes]
  );

  const q = searchQuery.trim().toLowerCase();

  const filteredLessons = useMemo(() => {
    if (!q && !onlyAuthored) return [];
    return lessons
      .filter((l) => {
        if (onlyAuthored && !AUTHORED_LESSONS[l.id]) return false;
        if (!q) return true;
        return `${l.id} ${l.title} ${l.track} ${l.module}`.toLowerCase().includes(q);
      })
      .slice(0, 80);
  }, [q, onlyAuthored]);

  const filteredRefs = useMemo(() => {
    return references
      .filter((r) => {
        if (onlyAuthored && !findAuthoredReference(r.category, r.title)) return false;
        if (!q) return true;
        return `${r.category} ${r.title} ${r.slug}`.toLowerCase().includes(q);
      })
      .slice(0, 120);
  }, [q, onlyAuthored]);

  return (
    <section
      aria-label="Curriculum and reference navigation"
      className={fullHeight ? "flex min-h-0 flex-1 flex-col overflow-hidden" : "shrink-0 border-b border-slate-200 bg-white/75 dark:border-white/10"}
    >
      <button
        type="button"
        onClick={fullHeight ? undefined : toggle}
        disabled={fullHeight}
        aria-expanded={open || fullHeight}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-slate-100/80 dark:hover:bg-white/[0.03]"
      >
        {(open || fullHeight) ? (
          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
        )}
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">
          Catalog &amp; Reference
        </span>
        <span className="ml-auto font-mono text-[11px] text-slate-500">
          {summary.tracks} tracks · {summary.plannedLessons} topics
        </span>
      </button>

      {(open || fullHeight) && (
        <div className={fullHeight ? "flex min-h-0 flex-1 flex-col px-3 pb-3" : "flex max-h-[42vh] flex-col px-3 pb-3"}>
          {/* Progress & Continue */}
          <div className="mb-2.5 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2 dark:border-white/[0.07] dark:bg-white/[0.02]">
            <ProgressRing percent={pct} size={28} stroke={2.5} color="#10B981">
              <span className="font-mono text-[8px] font-bold text-slate-700 dark:text-slate-200">
                {doneCount}
              </span>
            </ProgressRing>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {doneCount} / {AUTHORED_LESSON_IDS.length} authored samples
              </div>
              <div className="truncate text-[11px] text-slate-500">
                {summary.plannedLessons} topics mapped · {summary.referenceSubjects} references
              </div>
            </div>
            <button
              type="button"
              onClick={jumpToNextUnfinished}
              title="Open next authored sample lesson"
              className="flex shrink-0 items-center gap-1 rounded-lg border border-[#0284c7]/30 bg-[#0284c7]/10 px-2 py-1 text-[11px] font-semibold text-[#0284c7] hover:bg-[#0284c7]/20 dark:border-[#00F0FF]/30 dark:bg-[#00F0FF]/10 dark:text-[#7DEBFF]"
            >
              Continue
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-2 flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/70 p-0.5 dark:border-white/[0.06] dark:bg-black/25">
            {(
              [
                { id: 'curriculum', label: 'Curriculum', icon: FileCode2 },
                { id: 'reference', label: 'References', icon: BookOpen },
                { id: 'notes', label: `Notes (${noteIds.length})`, icon: StickyNote },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = sidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSidebarTab(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-white/[0.08] dark:text-slate-100 dark:shadow-none'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Inline filter */}
          {sidebarTab !== 'notes' && (
            <div className="mb-2 flex items-center gap-1.5">
              <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 dark:border-white/[0.08] dark:bg-black/25">
                <Search className="h-3 w-3 shrink-0 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={sidebarTab === 'reference' ? 'Filter 303 references...' : 'Filter 889 topics...'}
                  aria-label="Filter navigation list"
                  className="min-w-0 flex-1 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200"
                />
              </div>
              <button
                type="button"
                onClick={() => setOnlyAuthored(!onlyAuthored)}
                aria-pressed={onlyAuthored}
                title="Toggle between all planned entries and authored drafts only"
                className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors ${
                  onlyAuthored
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-[#6EE7B7]'
                    : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-3 w-3" />
                Authored
              </button>
            </div>
          )}

          {/* Scrollable content */}
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {sidebarTab === 'notes' && (
              <div className="space-y-1">
                {noteIds.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-500">
                    Notes written with the Notes button appear here and stay saved in this browser.
                  </p>
                ) : (
                  noteIds.map((id) => {
                    const l = lessonMap.get(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => selectLesson(id)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-left hover:border-[#0284c7]/40 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-[#00F0FF]/35"
                      >
                        <div className="break-words text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {id} · {l?.title ?? 'Lesson note'}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-slate-500">
                          {progress.notes[id]}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {sidebarTab === 'reference' && (
              <div className="space-y-1">
                {filteredRefs.map((ref) => {
                  const authored = Boolean(findAuthoredReference(ref.category, ref.title));
                  const isActive = activeView === 'reference' && selectedReferenceId === ref.id;
                  return (
                    <button
                      key={ref.id}
                      type="button"
                      onClick={() => selectReference(ref.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                        isActive
                          ? 'bg-[#8A2BE2]/15 text-[#6d28d9] dark:text-[#C9A0FF]'
                          : 'hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                        {ref.title}
                      </span>
                      <span className="truncate text-[11px] text-slate-500">{ref.category}</span>
                      {authored && (
                        <span className="shrink-0 rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-[#6EE7B7]">
                          draft
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {sidebarTab === 'curriculum' && (q || onlyAuthored) && (
              <div className="space-y-1">
                {filteredLessons.map((l) => {
                  const authored = Boolean(AUTHORED_LESSONS[l.id]);
                  const done = Boolean(progress.complete[l.id]);
                  const active = activeView === 'lesson' && selectedLessonId === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => selectLesson(l.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                        active
                          ? 'bg-[#00F0FF]/12 text-[#0284c7] dark:text-[#7DEBFF]'
                          : 'hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      ) : authored ? (
                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#0284c7] dark:text-[#00F0FF]" />
                      ) : (
                        <CircleDashed className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                          {l.id} · {l.title}
                        </div>
                        <div className="truncate text-[11px] text-slate-500">{l.module}</div>
                      </div>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                          authored
                            ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-[#6EE7B7]'
                            : 'text-slate-400'
                        }`}
                      >
                        {done ? 'done' : authored ? 'sample' : 'planned'}
                      </span>
                    </button>
                  );
                })}
                {filteredLessons.length === 0 && (
                  <p className="py-4 text-center text-xs text-slate-500">No matching topics.</p>
                )}
              </div>
            )}

            {sidebarTab === 'curriculum' && !q && !onlyAuthored && (
              <ul className="space-y-1">
                {tracks.map((track) => {
                  const isOpenTrack = expandedTrack === track.id;
                  const trackMods = modulesByTrack.get(track.id) ?? [];
                  const trackTopicCount = (lessonsByTrack.get(track.id) ?? []).length;
                  const hasSample = (lessonsByTrack.get(track.id) ?? []).some((l) => Boolean(AUTHORED_LESSONS[l.id]));
                  return (
                    <li key={track.id}>
                      <button
                        type="button"
                        onClick={() => setExpandedTrack(isOpenTrack ? '' : track.id)}
                        aria-expanded={isOpenTrack}
                        className={`flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors ${
                          isOpenTrack
                            ? 'border-[#8A2BE2]/30 bg-[#8A2BE2]/[0.07]'
                            : 'border-transparent hover:border-slate-200 hover:bg-slate-100/70 dark:hover:border-white/[0.08] dark:hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="rounded bg-[#0284c7]/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#0284c7] dark:bg-[#00F0FF]/12 dark:text-[#7DEBFF]">
                          {track.id}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="break-words text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {track.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {trackMods.length} modules · {trackTopicCount} topics
                          </div>
                        </div>
                        {hasSample && (
                          <span className="rounded border border-emerald-500/35 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-[#6EE7B7]">
                            sample
                          </span>
                        )}
                      </button>

                      {isOpenTrack && (
                        <ul className="my-1 ml-3 space-y-1 border-l border-slate-200 pl-2.5 dark:border-white/[0.07]">
                          {trackMods.map((mod) => {
                            const isOpenMod = expandedModule === mod.id;
                            const modLessons = lessonsByModule.get(mod.id) ?? [];
                            return (
                              <li key={mod.id}>
                                <button
                                  type="button"
                                  onClick={() => setExpandedModule(isOpenMod ? '' : mod.id)}
                                  aria-expanded={isOpenMod}
                                  className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.04]"
                                >
                                  {isOpenMod ? (
                                    <ChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                                  )}
                                  <span className="truncate">{mod.id} · {mod.title}</span>
                                  <span className="ml-auto font-mono text-[9px] text-slate-400">
                                    {mod.lessonCount}
                                  </span>
                                </button>

                                {isOpenMod && (
                                  <ul className="my-0.5 ml-3 space-y-0.5 border-l border-slate-200 pl-2 dark:border-white/[0.06]">
                                    {modLessons.map((l) => {
                                      const authored = Boolean(AUTHORED_LESSONS[l.id]);
                                      const done = Boolean(progress.complete[l.id]);
                                      const active = activeView === 'lesson' && selectedLessonId === l.id;
                                      return (
                                        <li key={l.id}>
                                          <button
                                            type="button"
                                            onClick={() => selectLesson(l.id)}
                                            className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-xs transition-colors ${
                                              active
                                                ? 'bg-[#00F0FF]/12 font-semibold text-[#0284c7] dark:text-[#7DEBFF]'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.04]'
                                            }`}
                                          >
                                            {done ? (
                                              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                                            ) : authored ? (
                                              <Sparkles className="h-3 w-3 shrink-0 text-[#0284c7] dark:text-[#00F0FF]" />
                                            ) : (
                                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
                                            )}
                                            <span className="min-w-0 flex-1 truncate">{l.title}</span>
                                            {authored && (
                                              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1 text-[8px] font-bold text-emerald-700 dark:text-[#6EE7B7]">
                                                sample
                                              </span>
                                            )}
                                          </button>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
