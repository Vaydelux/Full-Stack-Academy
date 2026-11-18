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

All eight computing and internet foundations lessons (00.01.01–00.01.08) use local Node.js lab fixtures rather than simulating server code in a React iframe. Learners can verify starter code via the documented ACADEMY_LAB_TARGET setting. The course has twelve authored lessons (four existing interactive samples and eight local foundations labs). Module 00.01 is fully authored; subsequent orientation modules remain planned. Run all lab tests with `npm run test:labs`.

## Developer Toolchain (00.02)

Eight complete lessons teach VS Code, PowerShell/Bash/WSL, Node runtime, package manager locks, scripts, configuration, Git/SSH and a workstation capstone. Each includes local starter and solution fixtures and acceptance tests. The catalog groups available lessons by module. Use Node.js 24 and Git to run the local exercises. npm remains the academy's package manager; pnpm is taught separately. The course now has 20 authored lessons (16 orientation lessons and four interactive samples). Manual workstation operations are self-assessed, not automatically certified.
