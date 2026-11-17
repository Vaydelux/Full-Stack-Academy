/* ------------------------------------------------------------------ */
/* Full-Stack Engineering Academy · v1.1 Type System                   */
/* ------------------------------------------------------------------ */

export type LessonKind = 'lesson' | 'lab' | 'debug';

export interface CurriculumTrack {
  id: string;
  title: string;
  level: string;
  outcome: string;
  officialReference: string;
}

export interface CurriculumModule {
  id: string;
  slug: string;
  track: string;
  trackTitle: string;
  title: string;
  level: string;
  outcome: string;
  sourceUrl: string;
  lessonCount: number;
}

export interface CurriculumLesson {
  id: string;
  slug: string;
  trackId: string;
  track: string;
  moduleId: string;
  module: string;
  title: string;
  level: string;
  type: LessonKind;
  estimatedMinutes: number;
  status: string;
  referenceUrl: string;
  prerequisites: string[];
}

export interface ReferenceSubject {
  id: string;
  category: string;
  title: string;
  slug: string;
  status: string;
  lessonCrossReferences: string[];
}

export interface CurriculumSummary {
  tracks: number;
  modules: number;
  plannedLessons: number;
  referenceSubjects: number;
  planningLessonMinutes: number;
}

export interface TrackGroup {
  id: string;
  name: string;
  subjects: string;
  trackIds: string[];
  accent: string;
}

export interface LessonChapter {
  t: number;
  label: string;
  color: string;
}

export interface LessonStep {
  id: string;
  at: number;
  file: string;
  title: string;
  copy: string;
  expected: string;
  code: string;
  highlightLines?: number[];
  checkpoint?: boolean;
}

export interface MentalFlowStep {
  label: string;
  caption: string;
  accent: 'cyan' | 'violet' | 'emerald';
}

export interface LessonQuiz {
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  misconception: {
    claim: string;
    correction: string;
  };
}

export interface LessonChallenge {
  title: string;
  description: string;
  starterCode: string;
  hint: string;
  solution: string;
  rubric: string[];
}

export interface LessonBugHunt {
  title: string;
  symptom: string;
  buggyCode: string;
  diagnosis: string;
  fixNote: string;
}

export interface LessonSource {
  label: string;
  url: string;
}

export type SandboxMode = 'react-live' | 'rsc-sim' | 'zod-live' | 'idor-sim';

export interface AuthoredLesson {
  id: string;
  headline: string;
  subtitle: string;
  stackBadge: string;
  level: string;
  estMinutes: number;
  duration: number;
  seed: number;
  fileName: string;
  sandboxMode: SandboxMode;
  problem: string;
  objectives: string[];
  predictFirst: {
    prompt: string;
    answer: string;
  };
  mentalSummary: string;
  mentalFlow: MentalFlowStep[];
  showStateFlowVisualizer?: boolean;
  showLifecycleVisualizer?: boolean;
  chapters: LessonChapter[];
  steps: LessonStep[];
  quiz: LessonQuiz;
  challenge: LessonChallenge;
  bugHunt: LessonBugHunt;
  reflection: string;
  sources: LessonSource[];
  relatedReferenceIds: string[];
  waveformEnergy: number[];
}

export interface AuthoredReference {
  id: string;
  matchCategories: string[];
  matchTitles: string[];
  heading: string;
  category: string;
  majorVersion: string;
  status: string;
  summary: string;
  syntax: string;
  lang: string;
  parameters: string;
  returns: string;
  minimalExample: string;
  productionExample: string;
  commonMistakes: string[];
  securityPerformanceNotes: string[];
  relatedLessonIds: string[];
  canonicalUrl: string;
}

export interface CapstoneMilestone {
  number: number;
  title: string;
  learningAreas: string;
  build: string;
  verify: string;
  bugHunt: string;
}

export interface MasterDocument {
  id: string;
  title: string;
  fileName: string;
  summary: string;
  scope: string;
}

export type WorkspaceView = 'overview' | 'lesson' | 'reference' | 'arena' | 'capstone';
export type SidebarTab = 'curriculum' | 'reference' | 'notes';
export type ThemeMode = 'dark' | 'light';
export type ViewportMode = 'desktop' | 'mobile';
export type PreviewStatus = 'booting' | 'ready' | 'error';

export interface ConsoleEntry {
  id: number;
  level: 'log' | 'info' | 'warn' | 'error';
  text: string;
  time: string;
}

