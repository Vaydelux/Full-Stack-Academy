> **NestJS P2 offline qualification — 2026-11-21 (draft PR #39):** Added three dependency-free source/behavior suites with **26 locally executed passing tests** in a temporary Node22 reconstruction (7 transaction, 11 data/privacy/context/events, 8 lock guard). The canonical root command is `npm run test:nestjs-offline`; nested labs use `npm run test:offline`. The real Node24/NestJS12/TypeScript6/isolated PostgreSQL/Socket.IO/browser/human accessibility release gates remain **unexecuted**; no genuine nested npm lock exists yet. **338/889 published**, PR stays draft/unmerged and Vercel deployment remains frozen. See [offline evidence and complete handoff](docs/NESTJS_OFFLINE_QUALIFICATION_CHECKPOINT_20261121.md).

> **P1 RHF 09.02 release handoff — 2026-11-20:** PR #38 now has a guarded `npm run promote:forms-query:rhf -- --plan` (read-only) and `--apply` (real Node24/Chromium preflight, truthful human a11y evidence, eight-lesson atomic publication, full post-promotion checks with rollback). React Hook Form, resolvers and TanStack Query remain correctly isolated in the **genuine nested React/Vite npm lock**, not the Next root. Previews, quizzes, module counters and lab batching now support an eight-lesson transition. **No apply, Node24/Chromium test or manual screen-reader review has been run in this environment; 338/889 is unchanged.** See `docs/P1_RHF_PROMOTION_CANDIDATE.md`.

> **RHF module release progress (2026-11-20):** PR #38 now has **eight complete source release bundles** for `09.02.01–09.02.08`: candidate MDX, metadata, starter/instructor source, lab manifest and browser-backed `solution.test.mjs` per lesson. A focused real browser runner allocates its own loopback ports and the source audit refuses premature publication. **All 8/8 candidate bundles were re-fetched and structurally checked; runtime tests and manual a11y have not executed.** The authoritative published count remains 338/889. [RHF release checklist](docs/P1_RHF_PROMOTION_CANDIDATE.md) · [PR #38](https://github.com/Vaydelux/Full-Stack-Academy/pull/38).

> **Phase P1 larger-scope candidate (2026-11-20):** All sixteen React Hook Form/TanStack Query staged articles now have in-depth production decision guides and proposed **noindex in-academy draft-reading routes** with separate quiz-progress isolation. The preview route and dedicated browser smoke are in [PR #38](https://github.com/Vaydelux/Full-Stack-Academy/pull/38) and are **not live or release-qualified**. Run `npm run status:forms-query-p1`, `npm run test:forms-query-p1-source`, and, on a local Node24/Playwright checkout, `npm run qualify:forms-query:preview-browser`. All **338** existing published lessons stay unchanged until executable labs, real build/browser testing and human accessibility acceptance pass. [Detailed acceptance](docs/P1_CONTENT_PREVIEW_ACCEPTANCE.md).

> **Complete the existing curriculum before expansion (2026-11-20):** A source-derived seven-phase program now tracks the remaining **551/889 unpublished** topics in **69 incomplete modules**. It correctly retains the already published interactive **15.02.04**, avoiding a duplicate in the 15.02 phase. Run `npm run status:publication-phases` for the live module plan and `npm run test:publication-phases` for the integrity gate. The current active phase is **P1, eight React Hook Form + eight TanStack Query lessons**, with PR #38’s consolidated MDX preview and publication release gates still pending (PR #36 was closed as superseded). [Full seven-phase publication program](docs/ACADEMY_889_PUBLICATION_PROGRAM.md) · [Current next tasks](docs/NEXT_TODO.md). **Published total is still 338**; no lesson was fabricated or prematurely promoted.

> **Forms/Query publication work (2026-11-20):** The latest `ec518b41` merge reports successful local Node24/React/Vite/SSR/Chrome qualification for all 16 staged Forms + Query lessons. This new milestone adds a [read-only 16-topic publication readiness checker](docs/FORMS_QUERY_PUBLICATION_READINESS.md), nine source-registry integrity tests, four npm-lock/generated-artifact hygiene checks, and removes accidentally committed Vite `dist/` files while keeping the true nested lockfile. The 16 packs are **still staged**, and 338 lessons remain published until required accessibility and atomic publication integration succeed. Run `npm run status:forms-query-promotion` and see [handoff](docs/NEXT_TODO.md). No GitHub Actions or Vercel checks.

> **Verified Forms/Query milestone (2026-11-20):** The loopback teaching API and clients passed **102/102 directly executed Node tests** across six suites in a byte-for-byte GitHub-source-matched partial checkout: 22 HTTP, 29 workflow, 20 TypeScript client, 9 native DOM event + real HTTP, 12 policy, 10 browser-navigation diagnosis. Chromium browser navigation was **blocked by managed organization policy** even though Node served the page with HTTP 200; the browser gate now reports this clearly. React libraries, the full Next build and the 15 actual Chrome UI checks **remain unqualified**. See [real test evidence](docs/FORMS_QUERY_REAL_NODE_ACCEPTANCE.md) and [next actions](docs/NEXT_TODO.md). Published lessons remain 338; the 16 RHF/Query articles are staged only. No Actions/Vercel.

> **Latest Forms/Query local application hardening (2026-11-20):** The dependency-free native task practice UI now has one write lock across create/status/delete, safe retry of unresolved POST using the **same** idempotency key, an explicit discard decision with duplicate warning, and correct handling of confirmed-create/follow-up-read failure. New [9-case native DOM+HTTP test source](tests/forms-query-native-ui.test.mjs) is wired into source/offline verification, and the optional Chromium gate has 15 cases including injected response-loss/422/409/revision races. 9/9 exact-source simulated interaction scenarios passed, **not actual real Node sockets/Chrome browser**. [Acceptance](docs/FORMS_QUERY_NATIVE_UI_ACCEPTANCE.md) · [Handoff](docs/NEXT_TODO.md). Published lessons unchanged at 338; RHF/Query 16 topics staged/unqualified. No GitHub Actions or Vercel checks.

> **Forms/Query reliability milestone (2026-11-20):** The standalone [task lab](examples/forms-query-vertical/README.md) now includes a typed cursor client, bounded TanStack infinite queries, serialized optimistic mutations, idempotent POST recovery, 20 real-HTTP regression tests authored for Node22+, and an optional native Chromium CDP test runner. 12 retry-policy and 11 UI-wiring tests passed in isolated source execution, and the typed HTTP scenarios passed 20/20 in a mocked request/response harness. **The latest real Node sockets, nested React package/typecheck/build, full Next build and browser suite have not run in this environment.** See [acceptance](docs/FORMS_QUERY_RESILIENCE_ACCEPTANCE.md) and [next steps](docs/NEXT_TODO.md). All 09.02/09.03 lessons remain staged, not published. No GitHub Actions or Vercel.

> **Curriculum authoring expansion (2026-11-20):** The academy now has 16 individually drafted React Hook Form and TanStack Query lessons—each with an MDX teaching sequence, red starter, instructor source and assessment contract—under [the prepublication staging directory](drafts/forms-query/README.md). Browse their titles from the local Practice Projects page at `/learn/projects/forms-query`. These are **staged only, not published lessons**; actual npm packages, TypeScript checks, learner tests, browser validation and a full Next build remain required. Check [acceptance evidence](docs/FORMS_QUERY_16_STAGING_ACCEPTANCE.md), [the full curriculum roadmap](docs/CURRICULUM_FINISHING_ROADMAP.md) and [handoff](docs/NEXT_TODO.md). Current published IDs remain 338; no GitHub Actions/Vercel checks.

> **Learning platform engineering update — 2026-11-20:** The academy's `/learn/projects` route now exposes a guided local Forms/Query task capstone with a loopback-only HTTP server, versioned task status workflow, filtered pagination, guarded Host/Origin validation, OpenAPI contract and browser request journal. The nested React Hook Form/TanStack Query client remains an **unqualified separate example** until actual dependency resolution and browser tests. 29 simulated request cases, 11 contract and 6 route checks passed; full real Node/Next/React builds remain outstanding. [Scope and evidence](docs/FORMS_QUERY_WORKFLOW_V3_ACCEPTANCE.md) · [Handoff](docs/NEXT_TODO.md). All 09.02/09.03 lessons remain planned. No Vercel or GitHub Actions verification.

> **Source milestone 2026-11-19 — Forms and Server State:** A real local task HTTP API, accessible native-form practice page, and separate genuine React Hook Form/TanStack Query draft source are available under [examples/forms-query-vertical](examples/forms-query-vertical/README.md). Actual Node HTTP integration tests: 22/22 passing. The separate React source is intentionally uninstalled/unlocked and not part of the production bundle; all 09.02/09.03 lesson IDs remain planned. The 16 topic reference URLs now point to correct official documentation. See [acceptance](docs/FORMS_QUERY_CAPSTONE_ACCEPTANCE.md) and [handoff](docs/NEXT_TODO.md). Full Next/Node 24/browser release checks remain outstanding; no GitHub Actions or Vercel inspection.

> **Learning Workflow v2 (2026-11-19):** The academy now has saved lessons/bookmarks, private notes beside published articles, a searchable saved-work dashboard, a calmer published lesson catalog with filters, same-origin multi-tab progress refresh, and bookmark-aware suggested study sessions. The new helper contract checks passed in an isolated transformed-source runner; full Node 24 dependency install, Next build and real browser gates still need to run. No Vercel or GitHub Actions checks. [Acceptance](docs/LEARNING_WORKFLOW_V2_ACCEPTANCE.md) · [Current handoff](docs/NEXT_TODO.md) · [Next Forms/Query plan](docs/FORMS_QUERY_NEXT_MILESTONE.md).

> **Development update — 2026-11-19:** All earlier curriculum/dashboard PRs #20–#26 are merged. The next study-planner milestone adds a suggested session queue (15–90 minutes), module focus and prerequisite-aware lesson ordering to /learn/dashboard. Nine exact-source Node model tests passed locally; the full Next.js/Node 24/browser release gate has not run. New forms/query topics 09.02/09.03 remain planned while npm registry resolution is unavailable. [Current handoff](docs/NEXT_TODO.md) · [Study planner acceptance](docs/STUDY_PLANNER_ACCEPTANCE.md) · [Forms/Query milestone](docs/FORMS_QUERY_NEXT_MILESTONE.md).

> **Current source status (2026-11-19):** All six previously stacked curriculum PRs [#20–#25](https://github.com/Vaydelux/Full-Stack-Academy/pulls?q=is%3Apr+is%3Amerged) are now merged into main. The subsequent learner-dashboard milestone adds /learn/dashboard to browse real local progress, unfinished lessons, modules, and validated JSON backup. **These are source-level merges, not evidence of a passing full Node 24 build or hosted release.** No GitHub Actions or Vercel checks were used. See [current handoff](docs/NEXT_TODO.md) and [dashboard acceptance](docs/LEARNER_DASHBOARD_ACCEPTANCE.md).

> **Track 10 source completion — 2026-11-19:** A new draft branch `feat/backend-security-openapi-complete` adds the complete Security/OpenAPI pair (16 lessons) to PR #24's Node/HTTP pair (16 lessons). Proposed stacked snapshot: **338 distinct published lesson IDs, 337 MDX and local labs, 42 complete modules, 38 quick-reference drafts**. The secure endpoint and generated OpenAPI JS client capstones passed two exact-source Node 22 HTTP integration tests; full Node 24 and Next/browser qualification remains outstanding. The local demo API is not production-ready. No Vercel or GitHub Actions inspections were performed. [Current handoff](docs/NEXT_TODO.md) · [Track 10 acceptance](docs/TRACK10_SECURITY_OPENAPI_ACCEPTANCE.md).

> **2026-11-19 Backend Track source milestone:** 16 new Node.js 24 / HTTP API lessons `10.01–10.02` plus actual local HTTP contract capstone on stacked branch `feat/node24-http-api-vertical-slice`. Proposed source totals **322 unique lesson IDs, 321 MDX lessons/labs, 40 complete modules** and 38 reference drafts. A Node 22 localhost HTTP test passed; full Node 24 dependency checks, Next build and browser qualification have **not** run. No Vercel or GitHub Actions checks. [Current TODO](docs/NEXT_TODO.md) · [Acceptance](docs/NODE_HTTP_VERTICAL_ACCEPTANCE.md) · [Large Scope Program](docs/LARGE_SCOPE_DELIVERY_PROGRAM.md).

> **Zustand 5 source milestone (2026-11-19):** New stacked `feat/zustand5-state-boundaries-live` branch extends unmerged PRs #20–#22 with eight genuine Zustand 5 lessons/labs and an interactive browser-only filter/state practice. Proposed source totals **306 unique published lesson IDs, 305 MDX/labs, 38 complete modules and 38 authored reference drafts**. This is NOT the current live site and has NOT passed local Node/Next/browser qualification. No Vercel or GitHub Actions checks were used. [Current TODO](docs/NEXT_TODO.md) · [State acceptance](docs/STATE_BOUNDARIES_ZUSTAND5_ACCEPTANCE.md).

> **Zod 4 source checkpoint (2026-11-19):** A third stacked feature branch `feat/zod4-schema-design-and-live-lab` now extends draft UI PR #21 and Next PR #20 with eight real Zod 4 schema lessons, browser-only profile validation practice and 18 Zod quick-reference drafts. Proposed stacked totals: **298 distinct published IDs, 297 MDX lessons/labs, 37 complete modules, 38 authored reference drafts**. This is NOT proof of a build/test or hosted release. No Vercel or GitHub Actions checks were used. [Handoff](docs/NEXT_TODO.md) · [Zod acceptance](docs/ZOD4_SCHEMA_ACCEPTANCE.md).

> **UI Systems source checkpoint — 2026-11-19:** Stacked branch `feat/ui-systems-track08-offline` builds on unmerged Next.js PR #20 and proposes **291 unique published lesson IDs, 289 MDX lessons/labs, 36 complete modules**, plus **20 authored reference drafts**. It authors every Track 08 lesson and an interactive UI gallery. The repository has **not** been locally compiled/tested or hosted-deployed for this change; no Vercel or GitHub Actions checks were performed. [Current TODO](docs/NEXT_TODO.md) · [UI acceptance](docs/UI_SYSTEMS_TRACK08_ACCEPTANCE.md).

> **Development source status (2026-11-19):** PR #19 merged to `main` at `651fb296`. A new unmerged `07.02–07.05` Next.js 16 full-track branch proposes **259 published lesson IDs, 257 MDX lessons / local labs, 32 complete modules** and 12 authored API reference drafts. This is NOT a claim that builds/tests passed or the hosted site changed. No Vercel or GitHub Actions checks were performed. See [handoff](docs/NEXT_TODO.md) and [Next 16 acceptance](docs/NEXTJS_16_FULL_TRACK_ACCEPTANCE.md).

> **Current source snapshot (2026-11-19):** React PR #17 and #18 are merged to `main`, with local execution not yet verified. Feature branch `feat/react-testing-next-router-offline` adds React Testing/Performance 06.05 and Next.js App Router 07.01: proposed **228 source-published IDs, 225 MDX/labs and 28 complete modules**. The hosted site has not been checked; no Vercel or GitHub Actions checks performed. See [handoff](docs/NEXT_TODO.md) and [acceptance](docs/REACT_NEXT_ROUTER_ACCEPTANCE.md). Publishing is not a production-test claim.

> **Source development checkpoint — 2026-11-19:** GitHub `main` contains 181 authored lesson IDs; draft PR #17 proposes 196 IDs; the stacked React Effects/Advanced candidate proposes **212 IDs / 209 MDX / 209 labs / 26 complete modules**. Neither PR is qualified as a hosted deployment. No Vercel or GitHub Actions checks are part of this offline development stage. [Current handoff](docs/NEXT_TODO.md) · [Advanced React acceptance](docs/REACT_EFFECTS_ADVANCED_ACCEPTANCE.md).

# Full-Stack Engineering Academy · v1.1

A content-first, interactive curriculum architecture and spatial course reader covering **TypeScript, React 19, Next.js 16, Tailwind CSS, Zod 4, NestJS/Fastify, PostgreSQL, Prisma 7, Supabase, Redis/BullMQ, testing, Docker/CI/CD, observability, and production engineering**.

## Scope & Honest Status

- **28 learning tracks** across 8 groups (Foundations, Frontend, Application development, Backend & databases, Production capabilities, Engineering quality, Specializations, Capstone)
- **111 structured modules** and **889 individually named planned lesson topics** (`data/curriculum.json`, `CURRICULUM_MASTER.md`)
- **303 indexed reference subjects** across 13 categories (`data/reference-index.json`, `REFERENCE_ENCYCLOPEDIA.md`)
- **4 authored sample lessons** (`lessons/*.md`) with full 10-stage pedagogy:
  - `06.01.01` — JSX: Describe a UI without manually building the DOM (live React/Babel JSX sandbox)
  - `07.02.01` — Where should this code run? Next.js Server vs Client Components (interactive RSC boundary simulator)
  - `09.01.02` — Why TypeScript cannot validate an API response (live Zod 4 `safeParse` runner)
  - `15.02.04` — The authorization bug that slips past login (interactive multi-tenant IDOR/BOLA simulator)
- **4 authored reference drafts** (`reference/*.md`): Zod 4 `safeParse`, Prisma 7 `$transaction`, NestJS `CanActivate` / Guards, Redis `SET EX`
- **4 specification documents**:
  - `CURRICULUM_MASTER.md` — full 889-topic curriculum map
  - `REFERENCE_ENCYCLOPEDIA.md` — 303-subject reference encyclopedia & 9-part page format
  - `COURSE_AUTHORING_STANDARD.md` — enterprise lesson, lab, quiz, bug hunt & QA standards
  - `CAPSTONE_LEARNING_PATH.md` — 13 progressive CollabSpace milestones (0–12) and reviewer rubric

**Not yet complete:** The remaining 885 lesson bodies, 299 reference articles, runnable lab starter/solution repositories, and production Fumadocs/NestJS/PostgreSQL backend remain to be authored and verified one module at a time. Planned topics are clearly marked and cannot be falsely completed.

## Running the Interactive Workspace

### 1. Spatial Next.js Reader (`src/`)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Features:
- Resizable 3-pane spatial workspace (Catalog & Docs, Playable Timeline & Editor, Live Sandbox / Simulator & Console/Private Notes)
- Global search (`/` or `Ctrl+K` / `Cmd+K`) across all 889 topics and 303 reference subjects
- Dark spatial and light editorial theme switching, local private notes, reflections, quizzes, self-assessed rubrics, and JSON backup/restore

### 2. Standalone Offline Prototype (`prototype/`)

Open `prototype/index.html` directly or serve `prototype/` statically:

```bash
python -m http.server 8080 --directory prototype
```

## Verification Commands

```bash
npm run typecheck   # TypeScript strict check
npm run lint        # ESLint
npm test            # Node curriculum & hygiene test suite
npm run validate    # Python catalog & prototype consistency validator
npm run build       # Production Next.js build
```


## November 2026 reader hardening

- Live JSX executes in an opaque-origin iframe without `allow-same-origin`; messages are checked against the active frame, source origin and parent origin. The module bundle has explicit CORS for sandbox loading.
- Planned lessons do not display the previous sample's code or preview.
- Progress backups are schema-validated and restored as an exact checkpoint, with invalid completion records discarded. Local completion remains **self-assessed** rather than independently graded.
- Keyboard shortcuts avoid forms, dialogs, links, buttons, and sliders.
- CI quality gates are in `.github/workflows/academy-quality.yml`.

See `docs/RELEASE_GATE.md` for the unresolved production/SEO/browser-testing work. Do not present 889 planned topics as 889 published lessons.


## Phase 2a: Real learning and reference routes

Browse `/learn`, `/learn/track/06`, `/learn/06.01.01`, `/reference`, and `/reference/zod-safeparse`.
These are server-rendered, individually addressable pages with dynamic titles and detailed instructional content. Published lessons link back to `/?lesson=<id>` for live practice.

Planned topics remain browsable but are marked `noindex`; they are **not** included as authored content in the sitemap. Set `NEXT_PUBLIC_SITE_URL` (HTTPS) to enable production canonical URLs and sitemap entries. This is an incremental upgrade of the existing reader, not yet a Fumadocs/MDX migration. See `docs/COURSE_CONTENT_ROUTING.md`.


## Phase 2b: MDX publishing system

The first authored lesson now lives in `src/content/lessons/06.01.01.mdx` with strict sidecar metadata. It demonstrates reusable lesson components and an accessible client-side quiz. The corresponding `labs/jsx-skill-card` folder includes a starter, an instructor solution and runnable React server-rendering tests.

Run `npm run verify:content` and `npm run test:labs` to validate the lesson. MDX is compiled only from reviewed repository source. The existing live workspace is preserved and is intentionally separate from server-side execution of arbitrary learner code.

Full guide: `docs/MDX_AUTHORING_PIPELINE.md`.

## Reading-first experience

The home workspace opens in Read lesson mode. Curriculum, search and notes remain available; the editable code preview, timeline and console are mounted in Practice mode only. The previous always-open three-pane layout is replaced with a focused two-panel practice area. Article routes remain independently accessible. Mobile provides a collapsible curriculum and Code/Output tabs.

## First foundations lessons

All eight computing and internet foundations lessons (00.01.01–00.01.08) use local Node.js lab fixtures rather than simulating server code in a React iframe. Learners can verify starter code via the documented ACADEMY_LAB_TARGET setting. That first foundation release had twelve authored lesson IDs; subsequent source milestones have expanded the authored curriculum substantially. Refer to docs/checkpoint.json for current source counts. Run all lab tests with `npm run test:labs`.

## Developer Toolchain (00.02)

Eight complete lessons teach VS Code, PowerShell/Bash/WSL, Node runtime, package manager locks, scripts, configuration, Git/SSH and a workstation capstone. Each includes local starter and solution fixtures and acceptance tests. The catalog groups available lessons by module. Use Node.js 24 and Git to run the local exercises. npm remains the academy's package manager; pnpm is taught separately. The course now has 20 authored lessons (16 orientation lessons and four interactive samples). Manual workstation operations are self-assessed, not automatically certified.

## Current project handoff and progress

The canonical multi-agent handoff is [AGENTS.md](AGENTS.md), [docs/PROJECT_CHECKPOINT.md](docs/PROJECT_CHECKPOINT.md), [docs/NEXT_TODO.md](docs/NEXT_TODO.md), and machine-checked [docs/checkpoint.json](docs/checkpoint.json). Run `npm run checkpoint:check` to verify authored/published counts; after changing the publication inventory, run `npm run checkpoint:write` and commit the generated snapshot. The earlier v1.1 overview sections remain historical and do not supersede these handoff files.

## Learning & Debugging Process (00.03) — release candidate

Eight authored MDX lessons cover nested errors, minimal bug reproduction, debugger watches, Network and Performance tools, technical questions, changelogs, experiment/ADR records, and environment mismatch troubleshooting. All have local test fixtures. **Do not claim live production availability until PR CI and deployment are verified.** Project checkpoints: `AGENTS.md`, `docs/PROJECT_CHECKPOINT.md`, `docs/NEXT_TODO.md`, and `docs/checkpoint.json`.

## HTML Document Structure (01.01) — preview release candidate

Eight HTML tutorials teach document structure, metadata, native landmarks, heading hierarchy, text/lists/quotations, descriptive links, responsive images, and a complete accessible content-page capstone. Every lesson includes a standalone offline HTML starter and instructor solution, Node structural tests and browser DevTools practice. The capstone also has responsive Chromium checks for real DOM, keyboard focus, local image loading, and mobile horizontal overflow. No cloud accounts or paid resources required. **PR preview content is not a production release until gates pass.**

## HTML Forms & Validation (01.02) — release candidate

Eight browser-native tutorials with standalone HTML/JS starter/solution fixtures cover labeling, constraint validation, GET vs POST semantics, no-script fallback, safe local file previews, modal/non-modal disclosure, native form event defaults, and inaccessible-form repair. JavaScript examples use synthetic information and do not send real submissions. Browser smoke checks native constraints, accessible names, keyboard interactions, mobile layout and explicit fallback behavior. Not production until release gates pass.

## Accessibility Foundations (01.03) — release candidate

Nine authored lessons and local starter/solution projects with accessible keyboard navigation, focus restoration, landmarks and status regions, W3C WCAG 2.2 principles, WCAG contrast ratio calculator, names and descriptions, original diagram alternatives plus accessible table, reduced-motion controls and a keyboard audit capstone. Node contract tests and Chromium keyboard/accessibility smoke added. These are educational checks and **not a formal WCAG 2.2 conformance audit**. Publication counts and production release are pending green CI, preview verification and merge.

### P1 forms and remote-state publication — RHF / TanStack Query

The academy has sixteen **unpublished source candidates** across React Hook Form (`09.02`) and TanStack Query (`09.03`), each with red/green TSX exercises. They are not counted as course completion until a full verified release. Published curriculum remains **338/889**.

Review source readiness without producing any publication changes:

```bash
npm run test:js-syntax
npm run qualify:forms-query:source
npm run promote:forms-query:rhf -- --simulate
npm run promote:forms-query:query -- --simulate
```

RHF must publish first. On a clean checkout with Node.js 24 and genuine Chromium/Next SSR execution, only `--apply` can publish, and it requires named, source-fingerprint-bound keyboard, screen-reader and 200% zoom evidence. The guarded publishers update local files and checkpoint, **not** GitHub branches, Vercel or production deployments. See `docs/P1_RHF_PROMOTION_CANDIDATE.md` and `docs/FORMS_QUERY_NEXT_MILESTONE.md`.

> **Deployment intentionally frozen:** Git-triggered Vercel deployments are disabled via `vercel.json` and the linked project's Ignored Build Step. GitHub Academy workflow is manual-only during the source-only P1 merge. See [docs/DEPLOYMENT_FREEZE.md](docs/DEPLOYMENT_FREEZE.md). No automatic application release on merge.

## P2 NestJS 12 — 32 source-only course drafts

The 11.01–11.04 track has 32 authored MDX draft lessons with paired red starter/instructor TypeScript examples under `drafts/nestjs/` and an isolated NestJS 12 teaching harness in `examples/nestjs-vertical/`. Run `npm run status:nestjs-drafts` or `npm run test:nestjs-drafts` for source-only integrity. Real Nest compilation and HTTP/WebSocket/persistence qualification require a trusted npm-generated lock, Node 24, and runtime test evidence. This work is not live publication; the academy remains **338/889 published**. See `docs/NESTJS_32_AUTHORING_CHECKPOINT.md`. Vercel Git auto-deploy remains intentionally disabled.
