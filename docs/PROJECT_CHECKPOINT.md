> **Latest — 2026-11-19 Track 10 complete in source:** `feat/backend-security-openapi-complete` extends draft #24 with 10.03 Security Boundaries and 10.04 OpenAPI & SDKs, adding **16 MDX lessons with 16 full labs**. With #24, all 32 Track 10 topics are authored; cumulative candidate **338 unique published IDs, 337 MDX/lab fixtures, 42 complete modules and 38 reference drafts**. Exact GitHub blob-matched security and generated-client capstone Node 22 runs passed, with both red starters failing `ERR_ASSERTION` correctly. Node 24 repo-wide Next/TypeScript/browser gates remain unexecuted. No Vercel/Actions checked. Handoff: [acceptance](TRACK10_SECURITY_OPENAPI_ACCEPTANCE.md) · [current TODO](NEXT_TODO.md).

> **2026-11-19 latest backend vertical slice:** `feat/node24-http-api-vertical-slice` extends draft PR #23 (itself on #22→#21→#20) with 16 authored Node.js 24 + HTTP API fundamentals lessons (`10.01–10.02`), 16 checked-in labs and a real HTTP loopback capstone. Proposed cumulative source snapshot: **322 unique published IDs / 321 MDX and labs / 40 complete modules / 38 reference drafts**. One exact capstone HTTP test passed on local Node 22, plus five separate manual 4xx probes; the full Node 24/Next/browser gates are unexecuted. No Vercel or GitHub Actions checked. [Acceptance](NODE_HTTP_VERTICAL_ACCEPTANCE.md) · [Large scope plan](LARGE_SCOPE_DELIVERY_PROGRAM.md) · [Handoff](NEXT_TODO.md).

> **Current stacked source (2026-11-19):** `feat/zustand5-state-boundaries-live` adds a complete 8-lesson `09.04` Zustand 5 module with actual vanilla stores, safe persistence exercise and browser-only filter gallery at `/learn/state-boundaries-lab`. It is stacked on unmerged PR #22 → #21 → #20, not merged into main. Proposed totals: **306 unique published IDs, 305 MDX and labs, 38 complete modules, 38 reference drafts**, and 583 catalog lessons planned. `09.02.01` remains noindex. **No executable Node/Next/browser tests have passed in this environment.** No Vercel/GitHub Actions checked. [Current handoff](NEXT_TODO.md) · [Acceptance](STATE_BOUNDARIES_ZUSTAND5_ACCEPTANCE.md).

> **Current stacked work 2026-11-19:** Zod 4 branch `feat/zod4-schema-design-and-live-lab` is based on draft UI PR #21 (itself on draft Next.js PR #20). Adds eight 09.01 real-Zod MDX lessons/labs, browser-only shared-schema form at `/learn/zod-profile-lab`, 18 Zod reference drafts (complete 19/19 indexed Zod references), route and local acceptance contracts. Proposed stacked totals **298 distinct published IDs, 297 MDX and labs, 37 complete modules, 38 reference drafts**. No local npm/Next/browser execution and no Vercel/Actions inspection. Next planned `09.02.01`. See [Zod acceptance](ZOD4_SCHEMA_ACCEPTANCE.md) and [handoff](NEXT_TODO.md).

> **Additional local tooling hardening:** The new `scripts/run-local-labs.mjs` replaces the 11,688-character npm aggregate lab command with a bounded manifest-based runner to avoid Windows shell limits. Its runtime behavior remains unexecuted pending the offline quality gate.

> **Current 2026-11-19 stacked development:** PR #20 is draft/unmerged on top of `main` at `651fb296`. A further branch `feat/ui-systems-track08-offline` adds **32 UI Systems lessons in 08.01–08.04**, 32 red learner starters/instructor labs, a browser-only component gallery at `/learn/ui-gallery`, eight CSS quick-reference drafts, route registration and local browser-smoke contracts. Stacked candidate source totals: **291 published unique IDs, 289 MDX and 289 labs, 36 complete modules, 20 reference drafts**. Local Node/Next/Chromium tests remain unexecuted; no Vercel/Actions checked. Next planned `09.01.01`. See [current handoff](NEXT_TODO.md) and [UI acceptance](UI_SYSTEMS_TRACK08_ACCEPTANCE.md).

> **2026-11-19 CURRENT checkpoint override:** PR #19 is successfully squash merged into `main` at `651fb296`, following earlier merged React PRs #17–18. An unmerged feature branch `feat/nextjs-16-complete-track-offline` now authors all 32 Next.js 16 topics `07.02–07.05`, with 32 red starters, instructor implementations, lab fixtures and course registry entries. Proposed source totals: **259 published IDs / 257 MDX / 257 labs / 32 complete modules**, 12 authored reference drafts. Exact local Node/Next build, browser and security integration gates are **not executed**. Next planned topic is `08.01.01`. [Current TODO](NEXT_TODO.md) · [Acceptance](NEXTJS_16_FULL_TRACK_ACCEPTANCE.md). No Vercel or GitHub Actions checked.

> **Current checkpoint — 2026-11-19 (replaces historical draft status):** PR #17 successfully merged into main (squash `6f6c0c9`); PR #18 successfully merged into main (squash `b92699d`). Both were owner-requested merges with unexecuted local tests. Feature branch `feat/react-testing-next-router-offline` now proposes React `06.05` and Next.js `07.01`: 16 new lessons and lab manifests. Source candidate count **228 lesson IDs, 225 MDX, 225 labs, 28 complete modules**. Source-only verification is not build, Chromium or deployed qualification. Next canonical topic `07.02.01`. [Handoff](NEXT_TODO.md) and [acceptance](REACT_NEXT_ROUTER_ACCEPTANCE.md). No Vercel/GitHub Actions checks.

> **2026-11-19 reference UX extension:** The stacked React branch includes eight additional React 19 API draft references (useState, useReducer, useEffect, useRef, useContext, useTransition, useOptimistic, useActionState) plus a keyboard-accessible search/category/status explorer. Total authored reference **drafts** rises from 4 to **12** of 303 indexed subjects; 291 remain index-only. The explorer and code have not been browser-tested in this environment and are not hosted release claims.

> **2026-11-19 active stacked candidate:** Branch `feat/react-effects-advanced-offline` builds on unmerged PR #17 at `687b1da`, adding React Effects/refs `06.03` and advanced hooks `06.04` (16 original MDX lessons and labs). **Source-proposed totals:** 212 lesson IDs / 209 MDX lessons / 209 lab fixtures / 26 complete modules. PR #17 remains draft/unmerged. This candidate has **not** been locally built or test-executed; no Vercel or GitHub Actions was inspected. `06.05` remains planned, with 8 lessons; Next.js `07` remains 40 planned. See `docs/REACT_EFFECTS_ADVANCED_ACCEPTANCE.md`.

> **Current GitHub development checkpoint — 2026-11-19.** CSS PR #14, JS/TS PR #15 and Git PR #16 are **merged into main** at baseline commit `7e8f42d`; earlier text below predates those merges. `main` contains 181 lesson IDs, 178 MDX bodies and 178 labs. That does **not** certify the hosted deployment, which was intentionally left on hold. Branch `feat/react-foundations-state-offline` adds React modules `06.01` and `06.02`: 15 additional lessons and labs, 196 published IDs, 193 MDX bodies/labs and 24 complete modules as a **proposed source snapshot**. These additions are not merged or released and **local build, content checks, lab tests and Chromium have not been executed in this environment**. The next canonical topic is `06.03.01`. Do not check Vercel or GitHub Actions for this milestone. See `docs/REACT_FOUNDATIONS_ACCEPTANCE.md` and the updated `docs/NEXT_TODO.md`.

> **Offline Git track checkpoint — 2026-11-19.** Track `05` has 24 new authored lessons across `05.01`–`05.03`, with disposable-repository exercises, team engineering policies and an actual three-package TypeScript contracts capstone. The cumulative development branch has **181 lesson IDs, 178 MDX lessons, 178 local labs and 22 complete modules**. These counts are **NOT production**: the live release remains at **61 lesson IDs**. Three successive candidates (#14 CSS, #15 JS+TS, this new Git branch) remain unmerged. Vercel remains on a deployment hold. Exact-head GitHub CI passed (run `44371495933`, commit `88326b5`), including 322 green labs, Next production build and Chromium regression. Additional starter-failure regression tests have been added for a final head check; no hosted deployment is authorized. Next uncompleted module: `06.01` React (one existing sample lesson).

# Full-Stack Academy — Verified Project Checkpoint

**Verified date:** 2026-11-18 (Asia/Manila)  
**Repository:** https://github.com/Vaydelux/Full-Stack-Academy  
**Production:** https://fullstack-academy-ecru.vercel.app/  
**Latest verified application release commit:** `394e6d0f620f4740912b0d50cbcbbf5aecc83e8e` — merged PR #12  
**Production Vercel deployment:** `dpl_5CsySTxdf8iRD2zQ1wpL4xcTBstX` (**READY**, commit matches release)  
**Post-merge main CI:** [run 44321173715](https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44321173715) — **verify and dependency-audit successful**.  
**Next offline milestone after JS + TS batch:** `05.01 — Git, Collaboration & Monorepos` (not yet authored).

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
