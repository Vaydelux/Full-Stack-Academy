# Full-Stack Academy — Next TODO (2026-11-19)

## Source of truth

- GitHub `main` is at `7e8f42d` after merges #14, #15 and #16. It contains 181 source-published lesson IDs; actual hosted production state is intentionally not checked.
- Active offline branch: `feat/react-foundations-state-offline` (PR pending). It proposes **196 lesson IDs, 193 MDX, 193 lab fixtures and 24 complete modules**.
- This milestone modifies only repository files. **No Vercel or GitHub Actions check** was performed. Do not claim successful build, browser tests or deployment.

## P0 — Finish integration and local acceptance of React batch 06.01–06.02

- [x] Author `06.01.02–06.01.08` components, children, conditions, keys, commits, events and dashboard capstone
- [x] Author `06.02.01–06.02.08` snapshots, batching, derived/immutable state, identity, lifted state, reducers and stale closures
- [x] Provide fifteen intentionally defective starters, separate instructor solutions, local tests and strict lab manifests
- [x] Register each lesson and metadata; update per-lab commands, full lab test suite, checkpoint and sitemap/browser smoke expectations
- [ ] Run `npm ci && npm run lint && npm run typecheck && npm test && npm run verify:content && npm run checkpoint:check && npm run test:labs && npm run test:red-react && npm run build` in a full local clone
- [ ] Run isolated local Next + Chromium `scripts/browser-smoke.mjs` and repair real failures; check 320px layout, keyboard and assistive technology separately
- [ ] Review metadata, code pedagogy, React 19 behavior and dependency exception before merging; keep PR unmerged until credible local evidence exists

## P1 — Next much-larger authoring program

- [ ] React `06.03`–`06.05`: **24 lessons** (Effects/refs, context/concurrency, testing/performance), 24 labs and representative interactive DOM tests
- [ ] Next.js `07.01`–`07.05`: **40 lessons** with server/client boundaries, App Router, caching/revalidation, auth, SEO, error/loading states and realistic offline fixtures
- [ ] Combine into **64 additional canonical topic IDs** after qualification of this React batch. Do not represent planned topics as authored.

## P2 — Platform and safeguards

- [ ] Reassess the 14 known dev-only Picomatch advisory reports before the temporary exception expires on **2026-12-02 UTC**
- [ ] Add real mounted React interaction tests (DOM/hydration): server markup checks do not prove click behavior or state preservation
- [ ] Improve W3Schools-like reference pages without turning un-authored index subjects into published articles
- [ ] Keep cloud infrastructure optional and no remote learner-code execution; preserve the reading-first UI and separate practice mode

## Handoff

Read `AGENTS.md`, `docs/PROJECT_CHECKPOINT.md`, `docs/checkpoint.json`, `docs/REACT_FOUNDATIONS_ACCEPTANCE.md` and `docs/LONG_SCOPE_DELIVERY_PLAN.md`. Resume from `06.03.01` only after the current branch passes local integration.
