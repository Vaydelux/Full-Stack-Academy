import curriculumJson from '../../../data/curriculum.json';
import referenceJson from '../../../data/reference-index.json';
import summaryJson from '../../../data/summary.json';
import type {
  CapstoneMilestone,
  CurriculumLesson,
  CurriculumModule,
  CurriculumSummary,
  CurriculumTrack,
  MasterDocument,
  ReferenceSubject,
  TrackGroup,
} from './types';

/* ------------------------------------------------------------------ */
/* Canonical curriculum & reference catalog (single source of truth)   */
/* ------------------------------------------------------------------ */

export const tracks = curriculumJson.tracks as CurriculumTrack[];
export const modules = curriculumJson.modules as CurriculumModule[];
export const lessons = curriculumJson.lessons as CurriculumLesson[];
export const references = referenceJson.entries as ReferenceSubject[];
export const summary = summaryJson as CurriculumSummary;

export const trackMap = new Map<string, CurriculumTrack>(tracks.map((t) => [t.id, t]));
export const moduleMap = new Map<string, CurriculumModule>(modules.map((m) => [m.id, m]));
export const lessonMap = new Map<string, CurriculumLesson>(lessons.map((l) => [l.id, l]));
export const referenceMap = new Map<string, ReferenceSubject>(references.map((r) => [r.id, r]));

export const modulesByTrack = new Map<string, CurriculumModule[]>();
for (const m of modules) {
  const list = modulesByTrack.get(m.track) ?? [];
  list.push(m);
  modulesByTrack.set(m.track, list);
}

export const lessonsByModule = new Map<string, CurriculumLesson[]>();
export const lessonsByTrack = new Map<string, CurriculumLesson[]>();
for (const l of lessons) {
  const modList = lessonsByModule.get(l.moduleId) ?? [];
  modList.push(l);
  lessonsByModule.set(l.moduleId, modList);

  const trackList = lessonsByTrack.get(l.trackId) ?? [];
  trackList.push(l);
  lessonsByTrack.set(l.trackId, trackList);
}

export const referenceCategories = Array.from(new Set(references.map((r) => r.category)));

/* ------------------------------------------------------------------ */
/* Course structure: 8 Learning Track Groups                           */
/* ------------------------------------------------------------------ */

export const TRACK_GROUPS: TrackGroup[] = [
  {
    id: 'foundations',
    name: 'Foundations',
    subjects: 'Computing, HTML, CSS, JavaScript, TypeScript, Git',
    trackIds: ['00', '01', '02', '03', '04', '05'],
    accent: '#00F0FF',
  },
  {
    id: 'frontend',
    name: 'Frontend',
    subjects: 'React 19, Next.js 16, Tailwind, shadcn/ui, accessibility',
    trackIds: ['06', '07', '08'],
    accent: '#8A2BE2',
  },
  {
    id: 'app-dev',
    name: 'Application development',
    subjects: 'Zod, forms, TanStack Query, Zustand, APIs',
    trackIds: ['09'],
    accent: '#10B981',
  },
  {
    id: 'backend-db',
    name: 'Backend and databases',
    subjects: 'Node.js, NestJS, Fastify, PostgreSQL, Prisma, Supabase',
    trackIds: ['10', '11', '12', '13', '14'],
    accent: '#00F0FF',
  },
  {
    id: 'production',
    name: 'Production capabilities',
    subjects: 'Authentication, authorization, Redis, BullMQ, real-time, storage, integrations',
    trackIds: ['15', '16', '17', '18'],
    accent: '#8A2BE2',
  },
  {
    id: 'quality',
    name: 'Engineering quality',
    subjects: 'Testing, security, Docker, CI/CD, observability, performance, architecture',
    trackIds: ['19', '20', '21', '22', '23'],
    accent: '#10B981',
  },
  {
    id: 'specializations',
    name: 'Specializations',
    subjects: 'Capacitor, Tauri, AI, analytics, distributed systems, enterprise governance',
    trackIds: ['24', '25', '26'],
    accent: '#00F0FF',
  },
  {
    id: 'capstone',
    name: 'Capstone',
    subjects: 'Build, secure, deploy, troubleshoot and operate a complete application',
    trackIds: ['27'],
    accent: '#8A2BE2',
  },
];

/* ------------------------------------------------------------------ */
/* Progressive Capstone Learning Path (13 Milestones: 0..12)           */
/* ------------------------------------------------------------------ */

export const CAPSTONE_MILESTONES: CapstoneMilestone[] = [
  {
    number: 0,
    title: 'Understand the product before coding',
    learningAreas: 'Client/server, requirements, Git, architecture diagrams',
    build: 'Draft product problem statement, roles (member, manager, admin), 6 workflows, data ownership matrix, and ADR-001 (modular monolith).',
    verify: 'Scenario completeness review with zero ambiguous role-dependent behavior.',
    bugHunt: 'Write three contradictory requirements and resolve them explicitly.',
  },
  {
    number: 1,
    title: 'Responsive public website',
    learningAreas: 'HTML, CSS, accessibility, TypeScript, React, Next.js SSR/SEO',
    build: 'Public landing, features, docs, landmarks, metadata, responsive navigation, consistent theme tokens.',
    verify: 'Keyboard-only navigation, visible focus, pnpm typecheck, canonical metadata, zero horizontal mobile overflow.',
    bugHunt: 'Broken sticky header, missing alt text, focus lost inside a mobile drawer.',
  },
  {
    number: 2,
    title: 'Component system and advanced forms',
    learningAreas: 'shadcn/ui, Radix, Zod 4, React Hook Form',
    build: 'Shared Button, Field, Dialog, Toast, EmptyState, LoadingSkeleton; validated create-workspace form.',
    verify: 'Label/ARIA associations, client-server matching Zod schema, positive & negative form tests.',
    bugHunt: 'Uncontrolled-to-controlled warnings and missing focus management.',
  },
  {
    number: 3,
    title: 'NestJS API and typed contracts',
    learningAreas: 'Nest modules, Fastify, Zod pipes, OpenAPI and generated clients',
    build: '/health and /v1/workspaces routes with request/response schemas, stable error envelope, OpenAPI docs.',
    verify: 'Generated TS client compiles, invalid payload returns 4xx, Pino logs carry request ID.',
    bugHunt: 'Unvalidated route parameters and accidental stack/data leakage in error responses.',
  },
  {
    number: 4,
    title: 'PostgreSQL and Prisma 7',
    learningAreas: 'Schema design, transactions, indexes, migrations, repository pattern',
    build: 'Workspace, Membership, Project, Task, Comment, AuditEvent, IdempotencyRecord tables with tenant keys & FKs.',
    verify: 'Clean migration from empty DB, round-trip persistence tests, query plan review, least-privilege DB role.',
    bugHunt: 'N+1 query, partial multi-write without transaction, missing composite index.',
  },
  {
    number: 5,
    title: 'Authentication and object-level authorization',
    learningAreas: 'Supabase Auth, Next SSR sessions, JWT verification, Nest guards, RLS',
    build: 'Signup/login/reset, API token verification, owner/member permissions, invite flow, private routes.',
    verify: 'Denied unauthenticated reads, cross-tenant reads/writes denied, expired token denied, user-supplied org IDs ignored.',
    bugHunt: 'BOLA/IDOR on a task ID, privilege escalation in request body, stale membership caching.',
  },
  {
    number: 6,
    title: 'Server state and optimistic UX',
    learningAreas: 'TanStack Query, Zustand, caching, invalidation, URL state',
    build: 'Sortable/filterable tasks list, optimistic status updates, rollback on failure, accessible empty/error states.',
    verify: 'Failed mutation restores UI, tenant-scoped query keys, server-side pagination.',
    bugHunt: 'Optimistic update leaves stale wrong state or duplicates after refresh.',
  },
  {
    number: 7,
    title: 'Storage and background jobs',
    learningAreas: 'Signed uploads, Supabase Storage, Redis/BullMQ, idempotency',
    build: 'Private attachments, background thumbnail/metadata job, email queue, persisted job status record.',
    verify: 'Cross-tenant download forbidden, oversized/bad MIME rejected, bounded retries, idempotent execution.',
    bugHunt: 'Signed URL over-exposed, duplicate email on worker crash, Redis cache evicts queue keys.',
  },
  {
    number: 8,
    title: 'Search, realtime and audit',
    learningAreas: 'PostgreSQL FTS, search UX, Supabase Realtime or SSE, audit trails',
    build: 'Tenant-scoped task search, live comment notification, immutable actor/action/time audit history.',
    verify: 'Search never leaks across tenants, duplicate live events deduped, reconnect recovery works.',
    bugHunt: 'Reconnect duplicates and unauthorized Realtime channel subscription.',
  },
  {
    number: 9,
    title: 'Quality and security engineering',
    learningAreas: 'Vitest, Playwright, integration tests, OWASP ASVS, contract tests',
    build: 'Acceptance suite covering public, member, manager, admin journeys; threat model & control evidence.',
    verify: 'Clean CI (lint, typecheck, unit/integration, contract, E2E); explicit negative permission tests.',
    bugHunt: 'Flaky test from non-deterministic time; hidden authorization bypass in repository.',
  },
  {
    number: 10,
    title: 'Deploy, observe and recover',
    learningAreas: 'Docker, GitHub Actions, reverse proxy, migrations, OpenTelemetry and Pino',
    build: 'Staging/production compose, separate worker, health probes, logs, traces, alerts, operational runbook.',
    verify: 'Fresh deploy, expand-contract migration, rollback test, backup restore drill, correlated trace.',
    bugHunt: 'Worker loses job on SIGTERM, Redis down, DB connection pool exhausted.',
  },
  {
    number: 11,
    title: 'Performance and cost review',
    learningAreas: 'Core Web Vitals, k6, EXPLAIN ANALYZE, caching and capacity',
    build: 'Workload profile, synthetic user journeys, top-3 latency & cost drivers optimized with evidence.',
    verify: 'Before/after comparison with stated hardware, dataset size, request mix, and p50/p95/p99.',
    bugHunt: 'Over-caching private data, hidden N+1, oversized DB pools across API replicas.',
  },
  {
    number: 12,
    title: 'Enterprise readiness review',
    learningAreas: 'Documentation, privacy, governance, maintainability, architecture',
    build: 'Architecture maps, API reference, backup policy, secrets inventory, upgrade plan, privacy export/delete.',
    verify: 'Independent reviewer can deploy, operate, diagnose, and recover using only docs.',
    bugHunt: 'Retroactive migration breaks a public contract without a compatibility window.',
  },
];

/* ------------------------------------------------------------------ */
/* Accompanying repository specification documents                     */
/* ------------------------------------------------------------------ */

export const MASTER_DOCUMENTS: MasterDocument[] = [
  {
    id: 'curriculum-map',
    title: 'Full curriculum map',
    fileName: 'CURRICULUM_MASTER.md',
    scope: '28 tracks · 111 modules · 889 named topics',
    summary: 'All 889 individually titled lesson, lab, and debug topics grouped by track and module with stable NN.MM.LL IDs.',
  },
  {
    id: 'reference-encyclopedia',
    title: 'Reference encyclopedia',
    fileName: 'REFERENCE_ENCYCLOPEDIA.md',
    scope: '303 subjects · 13 categories · 9-part template',
    summary: 'Separate fast-lookup encyclopedia contract: syntax, parameters, return values, minimal/production examples, mistakes, security/performance notes, related lessons, and official docs.',
  },
  {
    id: 'teaching-standard',
    title: 'Enterprise teaching standard',
    fileName: 'COURSE_AUTHORING_STANDARD.md',
    scope: '15-point lesson contract · Quality gates',
    summary: 'Requirements for detailed worked lessons, runnable verification, quizzes with explanations, bug hunts, honest completion states, and accessibility.',
  },
  {
    id: 'capstone-path',
    title: 'Progressive capstone learning path',
    fileName: 'CAPSTONE_LEARNING_PATH.md',
    scope: '13 milestones (0–12) · CollabSpace platform',
    summary: 'End-to-end collaborative workspace milestones with verification criteria, bug hunts, and final reviewer rubric.',
  },
];

