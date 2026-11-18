> **Offline multi-module candidate (2026-11-19).** The entire CSS track `02.01`–`02.04` is authored in branch `feat/02-01-css-fundamentals-offline`: 32 CSS lesson bodies and offline labs; **93 published IDs in branch metadata, NOT production**. The last verified application release still has **61** published IDs. This batch intentionally disables Vercel builds and preview deployments, and is not merged. Exact-head CI and real-device audit are separate release gates. Next planned module is `03.01 — JavaScript Deep Foundations`. See `docs/LONG_SCOPE_DELIVERY_PLAN.md` for larger progressive delivery batches.

# Full-Stack Academy — Verified Project Checkpoint

**Verified date:** 2026-11-18 (Asia/Manila)  
**Repository:** https://github.com/Vaydelux/Full-Stack-Academy  
**Production:** https://fullstack-academy-ecru.vercel.app/  
**Latest verified application release commit:** `394e6d0f620f4740912b0d50cbcbbf5aecc83e8e` — merged PR #12  
**Production Vercel deployment:** `dpl_5CsySTxdf8iRD2zQ1wpL4xcTBstX` (**READY**, commit matches release)  
**Post-merge main CI:** [run 44321173715](https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44321173715) — **verify and dependency-audit successful**.  
**Next offline milestone after CSS batch:** `03.01 — JavaScript Deep Foundations` (not yet authored).

> The release SHA above identifies the verified **application release**. Later documentation-only commits may update `main` and create a new Vercel deployment without changing lesson code. Always recheck current `main`, CI and production before a subsequent release.

## Authored versus planned — exact counts

- **Catalog**: 28 tracks, 111 modules, 889 planned topic IDs; reference index has 303 subjects.
- **Published lesson IDs**: **61**, from 58 authored MDX bodies plus 4 interactive sample models with one overlapping ID.
- **Local labs**: 58 starter/solution fixtures with executable tests.
- **Reference drafts**: 4 of 303 planned subjects; indexed entries are not equivalent to written reference articles.
- **Fully authored modules (7)**:
  - `00.01` Computing & Internet Mental Models — 8/8
  - `00.02` Developer Toolchain — 8/8
  - `00.03` Learning & Debugging Process — 8/8
  - `01.01` HTML Document Structure — 8/8
  - `01.02` HTML Forms & Validation — 8/8
  - `01.03` Accessibility Foundations — 9/9
  - `01.04` Web APIs & Security — 8/8

The other **828 catalog topics remain planned**. Do not mark them complete, award completion for unimplemented topics, or add them to the sitemap.

## Release 01.04 — verified evidence

[PR #12](https://github.com/Vaydelux/Full-Stack-Academy/pull/12) authored eight tutorials with prediction prompts, at least three worked steps, security notes, quiz, bug hunt, reviewed official-source links and honest local practice in:
DOM vs render tree; Fetch/JSON with HTTP, transport, parse and abort branches; URL and repeated query parameters; Web Storage/cookies; permission-sensitive clipboard; same-origin policy and CORS; CSP/sandbox/postMessage; and a DevTools request-triage capstone.

The PR-head and post-merge CI verified locked dependencies, lint, TypeScript, repository tests, strict metadata and content validation, checkpoint consistency, all **147 local lab tests**, Next.js production build, and isolated Chromium smoke covering previous lessons plus the eight new browser fixtures.

Authenticated Vercel preview HTTP checks on the exact PR head returned **200/index** for each `/learn/01.04.01` through `/learn/01.04.08`, and **200/noindex** for the planned `/learn/02.01.01`. The sitemap includes all eight authored lessons and excludes the planned topic.

Post-merge **production** HTTP checks confirmed the same published/planned status and sitemap boundaries on `https://fullstack-academy-ecru.vercel.app/`, and Vercel reported the production deployment READY for `394e6d0f620f4740912b0d50cbcbbf5aecc83e8e`. The deployed site's browser interactions were *not* independently tested with assistive technology on physical devices.

## Architecture and honest limitations

Next.js 16 App Router, React 19, Tailwind 4, trusted repository-reviewed compile-time MDX, Zustand browser-local self-assessed progress, isolated JSX preview sandbox and standalone offline HTML labs. No production academy authentication backend, cloud-saved progress, remotely executed learner code, real form upload, or server grading exists. Next.js, NestJS, Prisma and Supabase appear in the *learning catalog*; those do not imply they are all deployed application services.

The automated browser suite is meaningful engineering evidence, **not** an independent WCAG 2.2 audit or manual screen-reader test. Manual mobile/keyboard/assistive-technology testing remains P1. Never advertise WCAG certification.

### Security watch

- The development dependency graph has **14 high reports** associated with `GHSA-fc5q-39xc-vjpf` (Picomatch) under a documented **temporary exception expiring 2026-12-02 UTC**. They are not fixed; the reviewed runtime-only audit has **zero known reports**. See `docs/DEPENDENCY_SECURITY_REVIEW.md`.
- Do not force an incompatible major downgrade or disable security verification to get a green build. Maintain read-only CI, lockfiles, sandbox origin separation, explicit postMessage checks and no untrusted MDX compilation.

## Repository source of truth

- `AGENTS.md`, `COURSE_AUTHORING_STANDARD.md`, `CURRICULUM_MASTER.md`: engineering and content contracts.
- `data/curriculum.json`: canonical planned IDs and module boundaries.
- `data/reference-index.json`: indexed reference topics (not authored pages).
- `src/content/lessons/<id>.mdx` and `.meta.json`: truly authored lessons.
- `src/content/lesson-registry.tsx` and `src/lib/academy/published.ts`: actual publication registration.
- `labs/<slug>/`: starter, solution, manifest and executable tests.
- `scripts/browser-smoke.mjs`: Chromium behavior and publication boundary checks.
- `docs/checkpoint.json`: machine-checked numeric snapshot; `npm run checkpoint:check`.

## Next AI / maintainer instructions

1. Recheck GitHub `main`, open PRs, current CI and Vercel deployment; this file is a historical release checkpoint, not a live status API.
2. Start a feature branch from current `main` for **Module `02.01 — CSS Fundamentals`**; follow the exact eight IDs in `data/curriculum.json`. Read `docs/NEXT_TODO.md` first.
3. Each lesson requires MDX, strict metadata, official HTTPS sources, prediction, 3+ guided steps, quiz, bug hunt, honest lab rubric, and runnable local starter/solution/tests. Register in both publication registries.
4. Keep non-authored catalog URLs noindex and out of the sitemap; keep the reading-first UI and existing interactive samples intact.
5. Update human checklists and `docs/checkpoint.json` via `npm run checkpoint:write`; don't claim counts ahead of actually checked-in lessons.
6. Run dependency audit, npm ci, lint, typecheck, repository tests, content validation, all labs, Next build, Chromium and exact-head Vercel preview; only merge on green. Verify production on the resulting release SHA.
