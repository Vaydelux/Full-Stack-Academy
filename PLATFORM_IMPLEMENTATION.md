# Full-Stack Academy — Production Platform Architecture

## 1. Product promise

A modern curriculum/knowledge platform in the spirit of an interactive docs academy. It teaches actual engineering habits with precise step-by-step practical work, not a memorization of packages. Separate **learning paths**, **documentation reference**, **guided labs**, **debug arena**, **projects**, and **learner record**. UI style: minimal editorial typography, accessible side navigation, searchable chapters, command/file tabs, responsive reader, restrained motion, theme tokens, clear states and stable URLs.

### Course vocabulary

`Path → Track → Module → Section → Lesson → Activity` is the teaching hierarchy. `Reference` and `Playbook` are separate navigation roots. Link both directions: `Lesson → exact APIs used`, `Reference → first tutorial / deep dive / related bug hunts`.

### Product routes

| Route | User intention | Data ownership |
|---|---|---|
| `/` | Start / path selection | Static MDX |
| `/learn` | Resume / personalized home | Client state or Nest API |
| `/paths/[slug]` | Select a path | Git content |
| `/learn/[track]/[module]/[lesson]` | Read, work, quiz | MDX + progress API |
| `/reference` | W3Schools-style fast lookup | Git index |
| `/reference/[family]/[symbol]` | API / property detail | Git MDX |
| `/playbooks/[slug]` | End-to-end workflow | Git MDX |
| `/labs/[slug]` | Step-by-step lab runner | Git metadata + safe local runner |
| `/bug-hunt/[slug]` | Reproduce/debug broken code | Git assets + test results |
| `/projects/[slug]` | Build capstone incrementally | Git content + progress API |
| `/notes` | Private notes | Local browser / private database |
| `/review` | Spaced repetition | Learner state |
| `/settings` | Display and privacy preferences | Learner state |
| `/changelog` | Version updates, errata | Git content |

## 2. Recommended implementation stack

**Phase 1 — content-first:** Next.js 16 App Router, React 19, TypeScript, Fumadocs MDX + UI, Tailwind CSS v4, shadcn/ui, Radix UI, Shiki syntax highlighting, Zod content frontmatter validation, local search index, keyboard-friendly reader. No database required to publish public lessons.

**Phase 2 — persistent learning:** NestJS 12 + Fastify API, Supabase Auth, PostgreSQL + Prisma 7, Zod contracts, OpenAPI-generated SDK, TanStack Query, controlled progress and notes sync, staff authoring roles. Keep course prose as Git-reviewed MDX; store learner-specific state in PostgreSQL.

**Phase 3 — async features:** Redis cache / BullMQ for indexing, notification email, export, achievement calculations and deterministic grading metadata. Redis cache and queue should have separate capacity/eviction policies, separate instances when justified. Add OpenTelemetry + Pino + Sentry, retention policy, backups and audit trail.

**Phase 4 — advanced teaching:** Local containerized labs (downloadable) and optional safe, isolated per-user cloud runner with explicit quotas. Add instructor cohorts, assignments, peer reviews, certifications only after rubric validity and identity needs are addressed.

## 3. Source of truth and consistency

- `content/` is canonical for curriculum body text, labs, bug cases, reference entries, source links and errata.
- Course content may be presented with database summaries for search, but never silently edited by multiple systems.
- `packages/contracts` defines Zod runtime contracts and generates OpenAPI; browser clients are built from the published API schema.
- `packages/database` owns Prisma schema and migrations.
- `packages/ui` owns visual tokens and portable React components; server-only components stay in Next.js app.
- Content IDs are immutable, so learners keep progress even if topics are renamed.

## 4. Exact monorepo topology (target)

```text
fullstack-academy/
├── apps/
│   ├── web/                Next.js public docs + BFF
│   ├── api/                NestJS REST auth/progress/notes
│   └── worker/             BullMQ email/indexing/export
├── packages/
│   ├── ui/                 Design tokens + accessible components
│   ├── contracts/          Zod schemas + OpenAPI generator
│   ├── api-client/         Generated typed SDK
│   ├── database/           Prisma models + migrations
│   ├── content-schema/     Manifest/frontmatter validation
│   ├── course-runtime/     Progress, quiz, navigation logic
│   └── config/             ESLint, TS and tooling presets
├── content/
│   ├── tracks/
│   ├── reference/
│   ├── playbooks/
│   ├── labs/
│   └── bug-hunts/
├── lab-fixtures/           Reproducible starter and solutions
├── infra/                  Compose, Caddy, instrumentation
├── tests/                  E2E, API, contracts, content QA
├── docs/                   ADRs, design, editorial standard
└── pnpm-workspace.yaml
```

## 5. Learner state schema

- `profiles(id UUID PK references auth.users, display_name, locale, created_at)`
- `lesson_progress(user_id, lesson_id, content_version, state, started_at, validated_at, last_step_id, updated_at, UNIQUE(user_id,lesson_id))`
- `quiz_attempts(id, user_id, lesson_id, question_id, answer_key, correct, attempted_at)`
- `lab_attempts(id, user_id, lab_id, fixture_version, result, checked_at, verifier_version)`
- `learner_notes(id, user_id, lesson_id, body, updated_at, UNIQUE(user_id,lesson_id))`
- `review_queue(user_id, concept_id, interval_days, due_at, last_result, UNIQUE(user_id,concept_id))`
- `bookmarks(user_id, target_kind, target_id, added_at, UNIQUE(user_id,target_kind,target_id))`
- `content_versions(content_id, revision, published_at, deprecated_at)`
- `audit_log(id, actor_id, event_type, record_id, timestamp, metadata)`

**Security:** Every mutable record must be bound to the authenticated learner or authorized instructor. Next.js BFF supplies verified sessions but Nest API rechecks authorization. The browser never directly accesses a privileged Prisma connection. With Supabase privileged DB roles, RLS may be bypassed, so backend row authorization tests are mandatory. Keep role-scoped accounts separate, use private object buckets, sanitize untrusted notes for display. Never interpret notes as executable MDX.

**Offline behavior:** Local-only progress is a convenience; with login sync, use monotonic completion states, merge timestamps carefully, preserve authored notes on conflict, and offer manual resolution rather than silently deleting progress.

## 6. Reader and interaction requirements

### Desktop

- Left: scrollable hierarchical curriculum with progress counts, collapsed modules and search.
- Middle: wide but readable editorial column (~680–850px max); technical illustrations; prose, code, outcomes, prediction, steps, quiz, lab, bug hunt, recap.
- Right: sticky local TOC, private note, references, version badge, keyboard shortcuts.

### Mobile/tablet

- Responsive drawer for curriculum; TOC accessible through a collapsible panel.
- No horizontal page overflow; code blocks scroll independently; never reduce code fonts below legible sizes.
- Touch-friendly quiz answers and editor controls; sticky footer navigation if useful.

### Features

- User can jump to unfinished, show due reviews, bookmark, play optional audio reader, use floating transcript, take notes and export/import progress.
- Audio uses explicit opt-in, accessible transcripts and playback controls; don't fake playback availability.
- Live JSX requires a proper bundler and isolated renderer; static prototypes must label code as illustrative rather than execute uncompiled JSX.
- Bug drills show a failing symptom before offering hints, differential diagnosis, solution and regression tests.
- Reference search supports exact symbols (`useState`, `$transaction`, `SET EX`, `@UseGuards`) and aliases.
- Every code example may be copied; multi-file labs show exact filenames, diffs and PowerShell/Bash tabs.

## 7. Progress policy

| State | Meaning | Trigger |
|---|---|---|
| Not started | Never visited | Default |
| Read | Viewed content | Reading telemetry on device |
| Attempted | Submitted quiz/code | Explicit event |
| Practiced | Completed practice steps | Local self report / test |
| Validated | Passing evaluation | Quiz + objective lab test |
| Mastered | Sustained evidence, including review | Rechecks and capstone |

Do not gate the next chapter behind purely cosmetic completion. Show optional prerequisites with a 'test out' option. Planned lessons cannot be completed; published lessons alone contribute to official completion percentage.

## 8. Search and reference engine

Initial: indexed JSON manifest with client search and prefix/symbol aliases. As content expands, build-time index across titles, objectives, tags, commands and code comments. Use Fumadocs search integration or a simple maintained full-text engine. Include a separate references index (like W3Schools) and filters for product, category, version, and lifecycle state.

### Reference page contract

`id, family, symbol, syntax, parameters, return, errors, examples[minimal,production,anti], gotchas, accessibility/security/performance, version, lastVerified, canonicalSource, relatedLessons, deprecatedBy`.

## 9. Lab execution architecture

The public docs host NEVER executes arbitrary user backend code. Initially deliver downloadable starter repositories with local `pnpm test`, Docker Compose, seed data and solution tags. For a future cloud runner, provision dedicated ephemeral isolated workers, drop privileges, disable unrestricted outbound network, impose resource/time quotas, prevent access to production secrets, and destroy environments after completion. Never execute learner MDX or code on the Next.js server process.

## 10. Delivery/operational standards

- Website tested against Chrome, Firefox, Safari, mobile viewport and keyboard-only.
- WCAG 2.2 AA target and per-lab accessibility review.
- Links validated and APIs versioned; content changes never break stable learning IDs.
- Content build fails on duplicate IDs, missing official references, broken prerequisites, invalid code fences, missing code import paths or failing solution verification.
- Releases require security scanning, Sentry monitoring, Next.js production smoke checks, API contract checks, backup/restore rehearsal, performance baseline and rollback documentation.
- Incident/privacy features: progress export/delete, log minimization, notes encryption at rest via platform, retention and consent policy, no unnecessary analytics.

## 11. Enterprise teaching quality gates

A module may be tagged **ready for release** only if: 100% authored lessons; 100% lesson IDs and metadata valid; 100% internal links valid; each applicable lab has starter and solution refs tested; each high-risk topic reviewed for correctness; quizzes include explanations; at least one integrated bug hunt per module; relevant references crosslinked; no unverified version-specific claims; course is navigable with keyboard, mobile and screen reader. Release report lists all remaining exceptions explicitly.
