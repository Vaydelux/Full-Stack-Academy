# React 19 + Next.js 16 — 80-Topic Offline Authoring Acceptance

**Branch:** `feat/06-07-react-next-curriculum` · **Baseline main:** `7e8f42d` · **Status:** unverified feature branch · **Cloud:** no GitHub Actions, no Vercel deployment.

| Canonical module | Coverage | Test evidence available |
|---|---:|---|
| 06.01 Elements & Components | 8 (1 prior + 7 new) | React TSX initial SSR + pure props, keys, events, profile view-model contracts |
| 06.02 State & Lifecycle | 8 | Functional updates, immutability, reducers, identity, stale closure |
| 06.03 Effects & Refs | 8 | Purity, cleanup/dependency policy, refs, focus, timer |
| 06.04 Advanced React 19 | 8 | Context, custom hooks, transitions, deferred values, optimistic updates, Action state, boundaries |
| 06.05 Testing & Performance | 8 | Semantics, journeys, Profiler, memoization, concurrency, unstable keys |
| 07.01 App Router Fundamentals | 8 | Route groups, layouts, async params, errors, redirects, metadata |
| 07.02 Server & Client Architecture | 8 | RSC boundaries, Server Actions, BFF, streaming, private server imports |
| 07.03 Data & Caching | 8 | Next 16 explicit Cache Components, tags, invalidation, private isolation |
| 07.04 SEO & Web Performance | 8 | Metadata, OG, sitemap, JSON-LD, images, LCP/INP/CLS, SEO audit |
| 07.05 Deployment & Hardening | 8 | Environment, Proxy, runtimes, logging, upgrades, cache-leak bug hunt |

## Acceptance before merge

- [x] 79 distinct new canonical MDX articles, metadata and local lab manifests committed; 06.01.01 previously authored.
- [x] 79 instructor + student source contracts and local tests; actual React TSX samples or Next App Router syntax examples included.
- [x] Official documentation source links retained; no real keys, external services, registry calls or cloud builds.
- [x] Registry, package commands, checkpoint and next-todo updated in same branch.
- [ ] Run `npm run check:react-next:structure` and inspect any reported schema or missing path failures.
- [ ] Run 79 new actual lab tests (instructor positive and expected student negative), then all 257 labs.
- [ ] Run Node24 lint, strict TS check, MDX content validation, Next production compile locally.
- [ ] Run Chromium routes, sitemap, noindex and responsive readers on actual local build.
- [ ] Review React 19 hydrated effects and interactions in a browser; current SSR fixture checks do not execute effects or event callbacks.
- [ ] Review Next.js 16 cacheComponents opt-in, Route Handler execution, Server Action permissions and private response caching in an isolated app.
- [ ] Retest cross-browser accessibility and physical screen readers, security, and controlled 200% zoom.
- [ ] Merge **only when explicitly authorized**; keep GitHub Actions and Vercel usage off until requested.

### Nonclaims

The work is *authored code*, not production-ready verified course material yet. It does not imply a successful local npm install, a passing TypeScript or Next.js build, browser tests, deployment, cloud grading, real API authentication, or working App Router route examples in a running server. The source code intentionally separates actual pure assertions, React SSR initialization, and full request/client integration.
