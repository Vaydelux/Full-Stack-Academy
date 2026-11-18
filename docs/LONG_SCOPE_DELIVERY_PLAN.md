# Full-Stack Academy — Multi-Module Offline Delivery Plan

**Reviewed:** 2026-11-19 (expanded two-track JS/TS batch) · **Product goal:** Complete the canonical 889-topic curriculum with usable exercises, maintainable references and truthful progress signals. **Release mode:** no Vercel deployments until owner resumes.

## Decision

Work in **complete tracks or 2–4-module batches**, normally **16–40 lessons** per review cycle, rather than releasing one tiny module per PR. This reduces repeated integration overhead while preserving lesson-specific depth, tests and accessible UI. Do not treat larger scope as permission to skip labs, invent benchmark numbers or claim unverified content is published.

## Grounded curriculum coverage

The canonical source `data/curriculum.json` currently defines **28 tracks, 111 modules and 889 topic IDs**. The reference index holds **303 entries**, only four of which have authored drafts.

- **Released production baseline:** 7 complete modules; 61 published IDs, 58 MDX bodies and 58 labs. Last verified application release SHA `394e6d0`.
- **Offline CSS batch:** 4 CSS modules `02.01`–`02.04` (32 lessons, 32 offline labs) on a nonmerged branch. At batch completion, proposed branch total: **11 complete modules, 93 published IDs, 90 MDX bodies and 90 local labs**. The 93 figure is **not** live content.
- **Remaining planned after the candidate batch:** 796 curriculum topic IDs are not yet authored/published. This is a substantial multi-track project, not a nearly finished product.
- **Next JavaScript batch:** Track `03` = four modules, 32 canonical lessons; then track `04` TypeScript = four modules, 32 lessons.
- **Follow-on tracks:** `05` Git and collaboration (24); `06` React (40); `07` Next.js (40); `08` UI/UX (32); `09` forms/Zod/state (32); `10`–`18` backend, PostgreSQL, Prisma, Supabase, security, caching, realtime and integration curricula; `19`–`23` QA, delivery, observability, performance and architecture; `24`–`27` mobile/advanced platforms, governance and capstone. Always use exact canonical IDs before writing.
- **Separate reference program:** Author indexed subjects with syntax, return value, errors, examples, gotchas, security and last-reviewed source links; counts never increase merely by adding an index row.

## Expanded offline batch — 2026-11-19

After the CSS-track candidate, a distinct branch `feat/js-ts-two-track-offline` adds **64 canonical topics** across tracks `03` and `04`. Each lesson has a separate runnable starter/solution pair and a local regression test; `03.04` also has standalone browser HTML, while `04.02` has real strict compiler-negative assertions. The branch is **not production** and is not merged into the CSS PR.

- **Branch-only candidate cumulative totals:** 19 complete modules, 157 authored/published IDs, 154 MDX bodies and 154 labs, while the released production count remains 61 IDs.
- **Remaining catalog topics if this candidate passes:** 889 - 157 = **732 planned** (not yet authored). Four reference article drafts remain incomplete against 303 indexed reference subjects.
- **Next larger program:** tracks `05` (24 topics) + `06` (40) + `07` (40) = 104 lessons as one long development program with independent track-level qualification. The scope is a plan, not completed work.
- **Verification debt:** JS async cancellation/retry uses injected offline transport, TS type tests compile through strict tsc, and browser DOM exercises require Chromium. Do not present these as live network or hosted code-execution features.
- **Release hold:** Vercel remains intentionally suppressed, PRs remain draft/unmerged, and GitHub CI is not a Vercel deployment. A separate hosted release gate is required on explicit owner authorization.

## Git track completion candidate — 2026-11-19

- Current **offline candidate** `feat/05-git-monorepo-offline`: `05.01` Everyday Git (8), `05.02` Team Engineering (8), `05.03` pnpm & Turborepo (8), 24 lessons total.
- Three-module Git batch raises candidate coverage from 157 to **181** lesson IDs, from 154 to **178** MDX/labs, and from 19 to **22** complete modules. Production remains 61 IDs.
- The track's Git examples execute against fresh temporary local Git repositories, never the user's own files. Team policy tests simulate provider rules; actual CODEOWNERS/provider approval is **not** exercised.
- The monorepo capstone contains local `apps/api`, `apps/web`, `packages/contracts` TS sources, workspace manifests and a strict TypeScript build check. This is **not** a successful pnpm install, Turbo caching experiment or published npm package.
- Remaining React + Next.js program: 80 canonical topic IDs, including the **existing** authored `06.01.01`; 79 additional lesson IDs remain to author. All 104 IDs across tracks `05–07` form the complete program.
- Don't merge the stacked work into main while Vercel is paused. Qualify offline batches, record exact-head CI, and make deployment a separate owner-approved release phase.

## React + Next.js complete authoring program — 2026-11-19

- **79 new topics** authored and committed on `feat/06-07-react-next-curriculum`; together with existing `06.01.01`, tracks `06` and `07` have **80 complete lesson slots**, in 10 modules.
- **Source-only candidate totals:** 260 lesson IDs, 257 MDX articles, 257 offline labs, 32 complete modules, 629 remaining canonical topics. The hosted production website still has 61 lesson IDs; merged Git source is not deployed.
- **Testing boundaries:** Each React lab includes actual TSX component source and a React DOM Server initial-render test plus independent pure contract assertions. That cannot certify clicks, effects, hydration, transitions, aria-live updates or browser focus. Each Next.js lab includes real Next-oriented source and pure policy assertions, not a running App Router/caching integration test.
- **Validation gates:** static structural preflight, Node24 locked install, typed fixtures, all 79 new lab contracts, old labs, lint, TypeScript, Next production compile, Chromium routes/mobile/SEO, and finally manual/accessibility/security review. Keep all reports separated by executed vs still planned.
- **No GitHub Actions / Vercel:** new work is on a feature branch without an open PR. No deployment or cloud build is authorized; use local tests or a dedicated container with dependency access.
- **Long-range scope:** track `08` next; 629 canonical IDs remain planned, plus reference encyclopedia backlog. Continue by complete tracks and maintain machine-readable checkpoints for other AI assistants.

## Quality gate for every large batch

1. **Scope freeze:** Select exact IDs from `data/curriculum.json`, agree on module outcomes, define a realistic demonstrable capstone. Track risks and prerequisites.
2. **Authoring:** Each lesson needs original explanation, verified stack version, prediction, 3+ executable steps, quiz with rationale, bug hunt, official sources, independent local starter and solution.
3. **Practice evidence:** Starter intentionally fails a specific test; solution passes both static Node tests and representative real-browser behavior. For security or performance topics, record nonclaims and required measurements rather than fabricating remote behavior.
4. **Integration:** Register published content in both registries; planned lessons remain clearly labeled and noindex. Update all checkpoints and correct old browser assertions when a formerly planned topic becomes authored.
5. **Batch qualification:** Locked dependency install; strict metadata/schema, content validation and catalog consistency; lint, typecheck, Node and local labs; production Next build in isolated CI; Chromium with 320px and 1100px, keyboard, RTL, theme and motion cases as relevant; dependency/security audit. Fix and rerun on exact head.
6. **Accessibility and editorial review:** No WCAG claims without actual device and assistive-technology evidence. Student-facing explanations must not overpromise automation or grading.
7. **Deployment hold:** Keep Vercel Ignored Build Step `exit 0` and preview deployments disabled, branch unmerged/draft. CI builds locally in GitHub only; these are **not Vercel deployments**. Release only when owner expressly asks to re-enable hosting.
8. **Release gate:** When resumed, verify reviewed preview at exact HEAD, compare production SHA, merge only on green and record the new production baseline.

## Engineering debt and limits

- The known Picomatch dev-tool security exception has 14 high reports and expires **2026-12-02 UTC**. It is not fixed by a passing scoped audit.
- Browser-local self-assessed progress is not server persistence or tamper-proof grading.
- Current lab framework verifies checked-in solutions and can test learner-modified local starters; it is **not** a public cloud coding execution service.
- External deployment consumption is intentionally avoided, but GitHub Actions consumes separate GitHub minutes and therefore should run on consolidated batch heads, not every small worktree commit.
- Browser CI is not a physical-device WCAG certification; CSS performance lessons explicitly require DevTools evidence when claiming frame speed or CLS.

## Handoff format for a successor AI

Read `AGENTS.md`, `docs/PROJECT_CHECKPOINT.md`, `docs/NEXT_TODO.md`, `docs/checkpoint.json` and this plan; check GitHub PR #14, Vercel project settings and the most recent CI run. Choose the next **complete** track only after the CSS batch has green checks, and never merge or deploy while the quota-saving hold is active.
