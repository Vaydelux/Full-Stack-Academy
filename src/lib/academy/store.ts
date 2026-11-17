'use client';

import { create } from 'zustand';
import * as z from 'zod';
import {
  AUTHORED_LESSONS,
  AUTHORED_LESSON_IDS,
  diffLines,
  getStepAtTime,
} from './authored-content';
import { lessonMap, references } from './curriculum';
import type {
  ConsoleEntry,
  PreviewStatus,
  SidebarTab,
  ThemeMode,
  ViewportMode,
  WorkspaceView,
} from './types';

/* ------------------------------------------------------------------ */
/* Types & Backup Schema (Zod 4 validated)                             */
/* ------------------------------------------------------------------ */

export interface Toast {
  id: number;
  msg: string;
  tone: 'info' | 'success' | 'error';
}

interface Cursor {
  ln: number;
  col: number;
}

interface PulseState {
  lines: number[];
  key: number;
}

export const STORAGE_KEY = 'fullstack-academy-v1';

export const BackupDataSchema = z.object({
  complete: z.record(z.string(), z.boolean()).default({}),
  quizzes: z.record(z.string(), z.boolean()).default({}),
  rubrics: z.record(z.string(), z.array(z.number().int().nonnegative())).default({}),
  notes: z.record(z.string(), z.string()).default({}),
  reflections: z.record(z.string(), z.string()).default({}),
  theme: z.enum(['dark', 'light']).default('dark'),
});

export const BackupFileSchema = z.object({
  version: z.literal(1),
  data: BackupDataSchema,
});

export type PersistedProgress = z.infer<typeof BackupDataSchema>;

const EMPTY_PROGRESS: PersistedProgress = {
  complete: {},
  quizzes: {},
  rubrics: {},
  notes: {},
  reflections: {},
  theme: 'dark',
};

function loadPersisted(): PersistedProgress {
  if (typeof window === 'undefined') return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = BackupDataSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

function savePersisted(data: PersistedProgress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore storage quota failures */
  }
}

export interface AcademyState {
  /* navigation & catalog */
  activeView: WorkspaceView;
  selectedLessonId: string;
  activeSampleId: string;
  selectedReferenceId: string;
  sidebarTab: SidebarTab;
  searchQuery: string;
  onlyAuthored: boolean;
  commandOpen: boolean;
  expandedTrack: string;
  expandedModule: string;

  /* playback & code editor */
  isPlaying: boolean;
  currentTime: number;
  speed: number;
  hijacked: boolean;
  activeStepId: string;
  code: string;
  pulse: PulseState | null;
  selectedLine: number | null;
  cursor: Cursor;

  /* preview & diagnostics */
  previewStatus: PreviewStatus;
  previewError: string | null;
  consoleLogs: ConsoleEntry[];
  consoleBadge: number;
  hookValues: (string | number | boolean | object | null)[];
  renderCount: number;
  viewport: ViewportMode;
  runToken: number;

  /* drawer & layout */
  drawerTab: 'console' | 'notes';
  drawerOpen: boolean;
  drawerHeight: number;
  syllabusOpen: boolean;
  mobileTab: 'docs' | 'editor' | 'output';
  toast: Toast | null;

  /* learner persisted record */
  hydrated: boolean;
  progress: PersistedProgress;
}

export interface AcademyActions {
  hydrate: () => void;
  setActiveView: (v: WorkspaceView) => void;
  selectLesson: (lessonId: string) => void;
  selectReference: (refId: string) => void;
  setSidebarTab: (t: SidebarTab) => void;
  setSearchQuery: (q: string) => void;
  setOnlyAuthored: (v: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  setExpandedTrack: (trackId: string) => void;
  setExpandedModule: (moduleId: string) => void;
  jumpToNextUnfinished: () => void;

  /* timeline & editor */
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  tick: (dt: number) => void;
  seek: (t: number) => void;
  cycleSpeed: () => void;
  setCodeByUser: (code: string) => void;
  syncToLesson: () => void;
  loadSnippet: (code: string, title: string, lessonId?: string) => void;
  applyStep: (stepId: string) => void;
  setSelectedLine: (ln: number | null) => void;
  setCursor: (c: Cursor) => void;

  /* preview & console */
  setPreviewStatus: (s: PreviewStatus, err?: string | null) => void;
  pushConsole: (e: Omit<ConsoleEntry, 'id' | 'time'>) => void;
  clearConsole: () => void;
  setRuntimeState: (hooks: (string | number | boolean | object | null)[], renders: number) => void;
  setViewport: (v: ViewportMode) => void;
  requestRun: () => void;

  /* drawer & layout */
  setDrawerTab: (t: 'console' | 'notes') => void;
  toggleDrawer: () => void;
  setDrawerHeight: (h: number) => void;
  toggleSyllabus: () => void;
  setMobileTab: (t: 'docs' | 'editor' | 'output') => void;
  showToast: (msg: string, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;

  /* learner actions */
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
  markQuizPassed: (lessonId: string) => void;
  toggleRubricItem: (lessonId: string, index: number) => void;
  setReflection: (lessonId: string, text: string) => void;
  setNote: (lessonId: string, text: string) => void;
  markLessonComplete: (lessonId: string) => void;
  exportBackupJson: () => string;
  importBackupJson: (raw: string) => { ok: boolean; error?: string };
}

export type AcademyStore = AcademyState & AcademyActions;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

let consoleId = 0;
let toastId = 0;

const DEFAULT_LESSON_ID = '06.01.01';
const defaultAuthored = AUTHORED_LESSONS[DEFAULT_LESSON_ID];

function getActiveSample(sampleId: string) {
  return AUTHORED_LESSONS[sampleId] ?? defaultAuthored;
}

function stepChangePatch(state: AcademyState, t: number, silent: boolean): Partial<AcademyState> {
  const sample = getActiveSample(state.activeSampleId);
  const step = getStepAtTime(sample, t);
  const patch: Partial<AcademyState> = { activeStepId: step.id };
  if (step.id !== state.activeStepId && !state.hijacked && step.code !== state.code) {
    patch.code = step.code;
    if (!silent) {
      patch.pulse = { lines: diffLines(state.code, step.code), key: Date.now() };
    }
  }
  return patch;
}

function updateAndSaveProgress(
  state: AcademyState,
  updater: (prev: PersistedProgress) => PersistedProgress
): Partial<AcademyState> {
  const next = updater(state.progress);
  savePersisted(next);
  return { progress: next };
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

export const useAcademy = create<AcademyStore>((set, get) => ({
  activeView: 'lesson',
  selectedLessonId: DEFAULT_LESSON_ID,
  activeSampleId: DEFAULT_LESSON_ID,
  selectedReferenceId: references[0]?.id ?? 'zod-safeparse',
  sidebarTab: 'curriculum',
  searchQuery: '',
  onlyAuthored: false,
  commandOpen: false,
  expandedTrack: '06',
  expandedModule: '06.01',

  isPlaying: false,
  currentTime: 0,
  speed: 1,
  hijacked: false,
  activeStepId: defaultAuthored.steps[0].id,
  code: defaultAuthored.steps[0].code,
  pulse: null,
  selectedLine: null,
  cursor: { ln: 1, col: 1 },

  previewStatus: 'booting',
  previewError: null,
  consoleLogs: [],
  consoleBadge: 0,
  hookValues: [],
  renderCount: 0,
  viewport: 'desktop',
  runToken: 0,

  drawerTab: 'console',
  drawerOpen: true,
  drawerHeight: 230,
  syllabusOpen: true,
  mobileTab: 'docs',
  toast: null,

  hydrated: false,
  progress: EMPTY_PROGRESS,

  hydrate: () => {
    const loaded = loadPersisted();
    set({ progress: loaded, hydrated: true });
  },

  setActiveView: (activeView) => set({ activeView }),

  selectLesson: (lessonId) =>
    set((s) => {
      const catalogLesson = lessonMap.get(lessonId);
      if (!catalogLesson) return {};
      const authored = AUTHORED_LESSONS[lessonId];
      if (!authored) {
        return {
          selectedLessonId: lessonId,
          expandedTrack: catalogLesson.trackId,
          expandedModule: catalogLesson.moduleId,
          activeView: 'lesson',
          isPlaying: false,
          selectedLine: null,
          mobileTab: 'docs',
        };
      }
      const firstStep = authored.steps[0];
      return {
        selectedLessonId: lessonId,
        activeSampleId: lessonId,
        expandedTrack: catalogLesson.trackId,
        expandedModule: catalogLesson.moduleId,
        activeView: 'lesson',
        isPlaying: false,
        currentTime: 0,
        hijacked: false,
        activeStepId: firstStep.id,
        code: firstStep.code,
        pulse: { lines: diffLines(s.code, firstStep.code), key: Date.now() },
        selectedLine: null,
        previewError: null,
        runToken: s.runToken + 1,
        mobileTab: 'docs',
      };
    }),

  selectReference: (refId) =>
    set({
      selectedReferenceId: refId,
      activeView: 'reference',
      mobileTab: 'docs',
    }),

  setSidebarTab: (sidebarTab) => set({ sidebarTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setOnlyAuthored: (onlyAuthored) => set({ onlyAuthored }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setExpandedTrack: (expandedTrack) => set({ expandedTrack }),
  setExpandedModule: (expandedModule) => set({ expandedModule }),

  jumpToNextUnfinished: () => {
    const { progress, selectLesson } = get();
    const nextId = AUTHORED_LESSON_IDS.find((id) => !progress.complete[id]) ?? AUTHORED_LESSON_IDS[0];
    selectLesson(nextId);
  },

  /* timeline */
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  tick: (dt) =>
    set((s) => {
      const sample = getActiveSample(s.activeSampleId);
      const t = Math.min(s.currentTime + dt * s.speed, sample.duration);
      const atEnd = t >= sample.duration;
      return {
        currentTime: t,
        isPlaying: atEnd ? false : s.isPlaying,
        ...stepChangePatch(s, t, false),
      };
    }),
  seek: (t) =>
    set((s) => {
      const sample = getActiveSample(s.activeSampleId);
      const clamped = Math.min(Math.max(t, 0), sample.duration);
      return { currentTime: clamped, ...stepChangePatch(s, clamped, true) };
    }),
  cycleSpeed: () => set((s) => ({ speed: s.speed === 1 ? 1.5 : s.speed === 1.5 ? 2 : 1 })),

  /* editor */
  setCodeByUser: (code) =>
    set((s) => ({
      code,
      hijacked: true,
      isPlaying: false,
      toast:
        s.hijacked === false
          ? { id: ++toastId, msg: 'Editor unlocked — you are editing the code directly', tone: 'info' }
          : s.toast,
    })),

  syncToLesson: () =>
    set((s) => {
      const sample = getActiveSample(s.activeSampleId);
      const step = getStepAtTime(sample, s.currentTime);
      return {
        code: step.code,
        hijacked: false,
        pulse: { lines: diffLines(s.code, step.code), key: Date.now() },
        runToken: s.runToken + 1,
        toast: { id: ++toastId, msg: 'Synced editor back to lesson timeline', tone: 'success' },
      };
    }),

  loadSnippet: (code, title, lessonId) =>
    set((s) => ({
      ...(lessonId && AUTHORED_LESSONS[lessonId] ? { activeSampleId: lessonId, selectedLessonId: lessonId } : {}),
      code,
      hijacked: true,
      isPlaying: false,
      runToken: s.runToken + 1,
      selectedLine: null,
      mobileTab: 'editor',
      toast: { id: ++toastId, msg: `Loaded "${title}" into sandbox`, tone: 'success' },
    })),

  applyStep: (stepId) =>
    set((s) => {
      const sample = getActiveSample(s.activeSampleId);
      const step = sample.steps.find((x) => x.id === stepId);
      if (!step) return {};
      return {
        currentTime: step.at,
        code: step.code,
        hijacked: false,
        activeStepId: step.id,
        pulse: { lines: diffLines(s.code, step.code), key: Date.now() },
        runToken: s.runToken + 1,
      };
    }),

  setSelectedLine: (selectedLine) => set({ selectedLine }),
  setCursor: (cursor) => set({ cursor }),

  /* preview & console */
  setPreviewStatus: (status, err = null) =>
    set((s) => ({
      previewStatus: status,
      previewError: status === 'error' ? err : null,
      consoleLogs:
        status === 'error' && err
          ? [
              ...s.consoleLogs.slice(-199),
              {
                id: ++consoleId,
                level: 'error' as const,
                text: err,
                time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
              },
            ]
          : s.consoleLogs,
      consoleBadge: status === 'error' ? s.consoleBadge + 1 : s.consoleBadge,
    })),

  pushConsole: (e) =>
    set((s) => {
      const entry: ConsoleEntry = {
        ...e,
        id: ++consoleId,
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      };
      return {
        consoleLogs: [...s.consoleLogs.slice(-199), entry],
        consoleBadge: e.level === 'error' ? s.consoleBadge + 1 : s.consoleBadge,
      };
    }),

  clearConsole: () => set({ consoleLogs: [], consoleBadge: 0 }),
  setRuntimeState: (hookValues, renderCount) => set({ hookValues, renderCount }),
  setViewport: (viewport) => set({ viewport }),
  requestRun: () => set((s) => ({ runToken: s.runToken + 1 })),

  /* drawer */
  setDrawerTab: (drawerTab) =>
    set({
      drawerTab,
      drawerOpen: true,
      ...(drawerTab === 'console' ? { consoleBadge: 0 } : {}),
    }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  setDrawerHeight: (h) => set({ drawerHeight: Math.min(420, Math.max(132, h)) }),
  toggleSyllabus: () => set((s) => ({ syllabusOpen: !s.syllabusOpen })),
  setMobileTab: (mobileTab) => set({ mobileTab }),
  showToast: (msg, tone = 'info') => set({ toast: { id: ++toastId, msg, tone } }),
  dismissToast: (id) => set((s) => (s.toast?.id === id ? { toast: null } : {})),

  /* learner persisted progress */
  toggleTheme: () =>
    set((s) =>
      updateAndSaveProgress(s, (prev) => ({
        ...prev,
        theme: prev.theme === 'dark' ? 'light' : 'dark',
      }))
    ),

  setTheme: (theme) => set((s) => updateAndSaveProgress(s, (prev) => ({ ...prev, theme }))),

  markQuizPassed: (lessonId) =>
    set((s) =>
      updateAndSaveProgress(s, (prev) => ({
        ...prev,
        quizzes: { ...prev.quizzes, [lessonId]: true },
      }))
    ),

  toggleRubricItem: (lessonId, index) =>
    set((s) =>
      updateAndSaveProgress(s, (prev) => {
        const current = new Set(prev.rubrics[lessonId] ?? []);
        if (current.has(index)) current.delete(index);
        else current.add(index);
        return {
          ...prev,
          rubrics: { ...prev.rubrics, [lessonId]: [...current] },
        };
      })
    ),

  setReflection: (lessonId, text) =>
    set((s) =>
      updateAndSaveProgress(s, (prev) => ({
        ...prev,
        reflections: { ...prev.reflections, [lessonId]: text },
      }))
    ),

  setNote: (lessonId, text) =>
    set((s) =>
      updateAndSaveProgress(s, (prev) => ({
        ...prev,
        notes: { ...prev.notes, [lessonId]: text },
      }))
    ),

  markLessonComplete: (lessonId) =>
    set((s) => {
      const authored = AUTHORED_LESSONS[lessonId];
      if (!authored) return {};
      const quizOk = Boolean(s.progress.quizzes[lessonId]);
      const rubric = s.progress.rubrics[lessonId] ?? [];
      const rubricOk = authored.challenge.rubric.every((_, idx) => rubric.includes(idx));
      if (!quizOk || !rubricOk) return {};
      return {
        ...updateAndSaveProgress(s, (prev) => ({
          ...prev,
          complete: { ...prev.complete, [lessonId]: true },
        })),
        toast: { id: ++toastId, msg: `Sample lesson ${lessonId} marked complete`, tone: 'success' },
      };
    }),

  exportBackupJson: () => {
    const { progress } = get();
    return JSON.stringify({ version: 1, data: progress }, null, 2);
  },

  importBackupJson: (raw) => {
    try {
      const parsedJson: unknown = JSON.parse(raw);
      const result = BackupFileSchema.safeParse(parsedJson);
      if (!result.success) {
        return { ok: false, error: 'Backup JSON does not match expected v1 schema.' };
      }
      const incoming = result.data.data;
      set((s) => {
        // Restrict completions to authored sample IDs only (never falsely complete planned lessons)
        const allowedSet = new Set<string>(AUTHORED_LESSON_IDS);
        const filteredComplete: Record<string, boolean> = { ...s.progress.complete };
        for (const [k, v] of Object.entries(incoming.complete)) {
          if (allowedSet.has(k) && v) filteredComplete[k] = true;
        }
        const merged: PersistedProgress = {
          complete: filteredComplete,
          quizzes: { ...s.progress.quizzes, ...incoming.quizzes },
          rubrics: { ...s.progress.rubrics, ...incoming.rubrics },
          notes: { ...s.progress.notes, ...incoming.notes },
          reflections: { ...s.progress.reflections, ...incoming.reflections },
          theme: incoming.theme,
        };
        savePersisted(merged);
        return {
          progress: merged,
          toast: { id: ++toastId, msg: 'Progress backup restored locally', tone: 'success' },
        };
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON file' };
    }
  },
}));

