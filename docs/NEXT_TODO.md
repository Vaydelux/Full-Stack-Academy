# Full-Stack Academy — Current development handoff (2026-11-19)

## Repository truth
- Main: PR #17 merged as `6f6c0c9`; PR #18 merged as `b92699d`. Both were explicitly owner-authorized without local test execution, so passing build/browser verification is **NOT** established.
- Current new feature: `feat/react-testing-next-router-offline` based on main `b92699d`.
- Feature source snapshot: **228 published lesson IDs, 225 authored MDX bodies, 225 lab fixtures, 28 fully covered modules**, 12 authored API reference drafts and 303 indexed reference topics.
- No Vercel inspection. No GitHub Actions inspection. Do not imply source counts represent the live website.

## Milestone completed at source level
- [x] React `06.05.01–06.05.08`: RTL principles, accessible queries, user journeys, Profiler, memo, useMemo/useCallback, concurrency, stable-key bug hunt
- [x] Next.js `07.01.01–07.01.08`: project structure, route segments, layout/template, async params, loading/error, redirect/notFound, Link, metadata and a public-site capstone
- [x] 16 original MDX lessons with three guided steps, bug hunt, quiz, sources, rubrics, prerequisites and deliberately broken learner starters
- [x] 16 instructor solutions, 16 Node test files, 16 lab manifests, source registration, independent lab commands, aggregate lab scripts and red-starter test scripts
- [x] Add illustrative Next.js 16 `app/` sample tree at `labs/next-public-site/solution/app` (not a separately built app)
- [x] Add local Next/Chromium smoke script for all newly authored lesson routes, sitemap and mobile layout
- [x] Extend content schema to recognize `lab.next.*` correctly

## P0 — Quality qualification (not executed here)
- [ ] Clone exact PR head in a capable local environment with Node.js 24
- [ ] Run `npm ci && npm run verify:offline`; repair lint, TypeScript, MDX, content schema, Node test, existing labs and Next build failures
- [ ] Run `npm run test:red-react-performance && npm run test:red-next-router`; confirm each starter fails an actual assertion, not import errors
- [ ] Run local Next + isolated Chromium browser smoke; test keyboard, 320px, zoom, focus and accessibility
- [ ] Install and lock compatible React Testing Library, user-event and DOM runner before claiming real RTL execution; current checks use Node models and SSR and **do not** exercise RTL
- [ ] Build the isolated Next.js 16 capstone example and manually verify HTTP 200/404, metadata, redirects and error boundaries
- [ ] Recheck known dev-only Picomatch advisories before the previous scoped exception expires on 2026-12-02
- [ ] Review PR diff and merge only after credible local evidence or explicit owner risk acceptance

## Next large-scope development
- [ ] `07.02`: Server/Client Components and serialization boundaries (8 lessons)
- [ ] `07.03`: data fetching and caching; keep Cache Components mode explicitly separate from legacy conventions (8 lessons)
- [ ] `07.04`: forms, route handlers, auth boundaries and security (8 lessons)
- [ ] `07.05`: SEO, diagnostics, optimization and capstone (8 lessons)
- [ ] Enrich the reference encyclopedia beyond 12 authored drafts of 303 indexed subjects

Read `docs/REACT_NEXT_ROUTER_ACCEPTANCE.md`, `docs/checkpoint.json` and `AGENTS.md` before changing publication counts. **Next unimplemented topic: `07.02.01`.**
