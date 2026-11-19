# Full-Stack Academy — Next TODO

**November 19, 2026 · Unreleased large-scope candidate:** Branch `feat/06-07-react-next-curriculum`, based on merged main `7e8f42d`. **No new GitHub Actions**, no Vercel build, no feature PR. Main already contains #14 CSS + #15 JS/TS + #16 Git under CI-skip merges.

## Completed authoring scope: React + Next.js, 80 canonical topic IDs

- [x] Existing `06.01.01` React JSX sample preserved
- [x] Author **39 new React 19 topics**, `06.01.02`–`06.05.08`, with real instructor/starter TSX components, pure typed state contract modules and SSR initial-render tests
- [x] Author **40 Next.js 16 topics**, `07.01.01`–`07.05.08`, with App Router code examples and offline architecture contract tests
- [x] Cover all 10 complete modules: React elements, state, effects, concurrency, testing; Next App Router, RSC, caching, SEO, operations
- [x] Register all 79 new MDX bodies, metadata, lab scripts and content checkpoint; preserve 06.01.01
- [x] Retain `[skip ci]` commit messages, feature-branch-only work, no PR and no deployments
- [ ] Run **local** `npm ci && npm run verify:react-next:cheap && npm run test:react-next:offline && npm run test:react-next:red && npm run lint && npm run typecheck && npm run build` when a clone/Node24/dependencies become available
- [ ] Run isolated Chromium smoke for 80 authored routes plus prior CSS/JS/TS/Git regression
- [x] Repair reviewed examples: private handler defaults to 401 without verifier, publishing waits for successful persistence, document-title Effect restores previous state, Space shortcut avoids native controls
- [x] Add local MDX compiler, TS/TSX parser, and fail-closed snippet checks with no extra dependencies
- [ ] Repair any actual test/build defects; content is **unverified** until the above commands run
- [ ] Do not merge large-scope branch or resume Vercel without explicit owner request

## Next strategic program after verification

- [ ] Track `08` — APIs/backend foundations (next canonical topic `08.01.01`)
- [ ] Expand the remaining **630 planned topic IDs**, prioritizing complete adjacent tracks rather than random content additions
- [ ] Expand encyclopedia: **303 index entries**, only **4 authored reference drafts**
- [ ] Normalize and review actual Next.js 16 Cache Components examples against target project settings
- [ ] Add browser-level React Testing Library interactions; current React fixtures prove initial SSR markup and pure state semantics, not hydrated UI behavior
- [ ] Real Next App Router render/request/cache/route handler integration tests remain pending; standalone examples are not running server routes

## Security and release blockers

- [ ] Reassess 14 high dev-tool Picomatch advisories before 2026-12-02 UTC exception expiry
- [ ] Physical-device keyboard/assistive tech tests, authenticated data isolation, accessibility and actual performance traces
- [ ] Keep Vercel on existing production build. Three merge-related Vercel webhook attempts were **canceled**; no production deployment of newly merged source
- [ ] Favor local QA over GitHub Actions until owner re-enables it. Do not weaken tests to create false green status

**Branch-only proposed counts:** 259 authored/published lesson IDs; 257 MDX + 257 offline lab manifests; 32 complete modules; 889 canonical topics. **Live deployment remains at 61 lesson IDs** because deployment is paused. `docs/checkpoint.json` and `docs/REACT_NEXT_OFFLINE_ACCEPTANCE.md` are handoff sources.
