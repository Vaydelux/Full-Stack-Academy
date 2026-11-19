> **2026-11-19 milestone:** PR #17 and #18 are merged to main; tests were not executed before owner-authorized merge. Active feature branch `feat/react-testing-next-router-offline` adds `06.05.01–06.05.08` and `07.01.01–07.01.08`, plus local lab fixtures and Next app sample. Qualify using `npm ci && npm run verify:offline`, red-starter gates and isolated local browser tests. No Vercel/GitHub Actions checks. True RTL needs locked RTL/user-event/DOM dependencies; Next sample is not independently compiled. The next canonical topic is `07.02.01`. Use `docs/REACT_NEXT_ROUTER_ACCEPTANCE.md` and `docs/checkpoint.json` for handoff.

> **Offline quality command:** On a full local checkout, run `npm ci && npm run verify:offline` for lint, types, repo tests, metadata/schema, checkpoint, all checked-in lab solutions, failing-starter gates and local Next build. This script never runs Vercel or GitHub Actions and is not a substitute for local Chromium/physical accessibility qualification. Its existence does not mean it has run or passed.

> **2026-11-19 active stacked development:** React Effects and Advanced Hooks branch `feat/react-effects-advanced-offline` builds on PR #17 (which is still unmerged). This branch authors `06.03–06.04` with 16 offline React 19 labs and an expected source snapshot of 212 IDs / 209 MDX/labs. Do not merge out of order; do not check Vercel or GitHub Actions; run local compiler, lint, content tests, red-starter/instructor labs and Chromium before changing draft status. `06.05` and Next.js `07` remain planned. See `docs/REACT_EFFECTS_ADVANCED_ACCEPTANCE.md`.

> **2026-11-19 handoff override for this active milestone:** Current branch `feat/react-foundations-state-offline` targets 15 additional offline React lessons across `06.01` and `06.02`. PRs #14–#16 are already merged. The owner has explicitly requested **no Vercel or GitHub Actions checks** for current development. Do local lint, types, tests, content validation, Next compilation and browser smoke when a full clone is available; do not claim those have passed without executing them. Do not merge while checks remain unverified. Next milestone after this batch: `06.03`–`06.05` + Next.js `07.01`–`07.05`.

# AI / Engineer Handoff — Full-Stack Academy

**Read this file first, then [docs/PROJECT_CHECKPOINT.md](docs/PROJECT_CHECKPOINT.md), [docs/NEXT_TODO.md](docs/NEXT_TODO.md), and [docs/checkpoint.json](docs/checkpoint.json).** This repository is the source of truth; chat summaries and stale branch names are not.

## Goal
Build a complete, beginner-friendly-to-enterprise full-stack learning platform with a calm reading-first design, separate runnable practice, modern topic-separated curricula, and W3Schools-like searchable technical references. Canonical plan: `CURRICULUM_MASTER.md`, `COURSE_AUTHORING_STANDARD.md`, `REFERENCE_ENCYCLOPEDIA.md`, `CAPSTONE_LEARNING_PATH.md`.

## Workflow contract (mandatory for successor AI)
1. `git fetch origin`; inspect `main`, the open PRs, CI runs, and production deployment **before** changes. Never assume the last chat's branch is current.
2. Read the checkpoint, task list, and `docs/DEPENDENCY_SECURITY_REVIEW.md` before proposing a release.
3. Branch from current `main` (or explicitly stack on an open PR); make focused commits. Do not push directly to main.
4. Authored lessons require: stable catalog ID, `.mdx`, strict `.meta.json`, a starter, instructor solution, `lab.json`, executable tests, official HTTPS documentation, prediction, 3+ worked steps, a quiz, bug hunt, and an honest self-assessment rubric.
5. **Register** each MDX/metadata in `src/content/lesson-registry.tsx` and `src/lib/academy/published.ts`; the catalog alone does not publish.
6. Update `docs/NEXT_TODO.md` when scopes change; update `docs/PROJECT_CHECKPOINT.md` with decisions and verification evidence; run `npm run checkpoint:write` and commit its output every time publication counts change. CI checks it automatically.
7. Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run validate`, `npm run verify:content`, `npm run checkpoint:check`, `npm run test:labs`, and `npm run build` (or ensure CI executes every gate). Browser smoke must pass. Do not claim hands-on device testing if unavailable.
8. Open a PR, confirm the preview matches the head SHA, inspect security advisories, and merge only after all blocking checks pass. Check the resulting production SHA after deploy. Stop on failing gates; leave a documented blocker.

## Architecture and safety
Next.js 16 App Router, React 19, Tailwind 4, MDX from trusted Git-reviewed source only, Zustand local self-assessed progress, browser sandbox with opaque origin. Backend (NestJS/Fastify, Supabase/PostgreSQL, Prisma 7, Zod, Redis/BullMQ) is a planned *teaching stack*, **not** currently implemented as academy services. Do not silently add cloud costs or a public arbitrary-code execution backend.

Preserve distinction: the catalog holds 889 planned topic IDs; MDX and interactive models are actually authored lessons. A catalog entry is not a finished course. Guard private data and keep code labs offline/local.
