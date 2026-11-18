# Full-Stack Academy — Multi-Module Offline Delivery Plan

**Reviewed:** 2026-11-19 · **Product goal:** Complete the canonical 889-topic curriculum with usable exercises, maintainable references and truthful progress signals. **Release mode:** no Vercel deployments until owner resumes.

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
