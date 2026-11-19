# Full-Stack Academy — Current Engineering Handoff (2026-11-20)

## Mainline state, status and counts

- Source baseline: PRs #20–#31 are merged. Latest work is `feat/forms-query-resilience-real-contract-tests-20261120`: harden the real Forms/Query teaching application before publishing 09.02 and 09.03.
- Canonical curriculum **28 tracks, 111 modules, 889 topics**. Published **338 unique IDs, 337 MDX articles / 337 published lab manifests, 42 complete modules**. There remain **551 unpublished** topics; **16** have staged MDX+red/instructor lab packs, leaving **535** topics without staged packs.
- **No new RHF/Query topic is published by this feature.** The 16 completed source drafts live under `drafts/forms-query/` until npm library tests, negative-starter gates and Next/browser acceptance pass.
- No GitHub Actions or Vercel checks. The education-only Task API remains loopback-bound, in-memory and unauthenticated; do not deploy it publicly.

## Latest work completed in source

- [x] Replace the first-page-only standalone React task list with bounded TanStack Query 5 `useInfiniteQuery`, status-scoped stable keys, real API cursor usage, Load More, AbortSignal propagation and explicit 409 restart.
- [x] Introduce one synchronous single-flight mutation boundary so create, status and delete cannot overlap optimistic snapshots; update all infinite-query pages during speculation, restore snapshots on failures, reset from page one after writes.
- [x] Distinguish confirmed POST from subsequent GET failure. Preserve original payload and idempotency key for ambiguous network/503/429 outcomes, while rejecting indefinite retries after terminal validation/conflict responses.
- [x] Strengthen standalone TypeScript API client validation and Node22 type-stripping import compatibility.
- [x] Add 20-case true-socket **test source** for typed HTTP client (idempotent replay, lost POST response, input rejection, 14-item pagination, 409 cursors, 412 competing revision edits, delete, capacity and cancellation).
- [x] Add 12 pure state/retry policy cases, 11 structural UI wiring cases, all wired into root offline gate and source qualification.
- [x] Add optional local Node22+ Chrome/Edge/Chromium CDP browser gate for native HTML app: whitespace input, POST/PATCH/DELETE, status filters, 15-item pagination, mobile/tablet/desktop overflow and keyboard Tab focus.
- [x] Extend staged TypeScript AST/syntax scan to all 34 staged TSX files plus six standalone React/Vite TS/TSX files.
- [x] Correct staged 09.02.05, 09.03.05, 09.03.08 instructor examples; exact lesson/source MDX parity remains intact.
- [x] Update academy project page, runbook, acceptance and agent handoff.

## Executed evidence (precise, not full release qualification)

- [x] **20/20** typed-client API scenarios executed against exact committed server/client logic in an **isolated mocked request/response harness**. First harness pass was 19/20 because it ignored custom server capacity; corrected harness passed 20/20 with original sources. This is **not** the real Node HTTP socket test run.
- [x] **12/12** pure policy cases executed against type-stripped exact GitHub source with equivalent HTTP error class.
- [x] **11/11** React UI source wiring assertions executed against exact GitHub files; not a React DOM test.
- [x] **3/3** revised staged lesson/source snippet parity checks.
- [x] Node 22.16 type-stripping minimal import sample executed locally; Chromium 144 CDP WebSocket handshake/JavaScript evaluation independently executed locally.
- [ ] Real latest Node socket run over all six Forms/Query suites; full Git checkout was unavailable.
- [ ] New Chromium script end-to-end on repository's real HTML app; headless CDP capability probe is **not** a pass of the site.
- [ ] Actual compatible RHF/resolvers/TanStack/Zod npm installs and generated nested lockfile; no registry DNS.
- [ ] Standalone React typecheck/build; mounted React DOM/browser flows, SSR hydration, mobile/zoom/screen reader.
- [ ] Node24 root npm ci, all 337+ local labs and negative starters, content/checkpoint scripts, lint/typecheck/Next production build.

## Ordered next actions

1. **Qualify real HTTP immediately on any full Node 22/24 checkout:** `npm run qualify:forms-query:source` (uses genuine Node listeners and typed client test file). Fix and commit actual failures.
2. **Qualify native browser:** `npm run qualify:forms-query:browser` with a local Chrome/Edge/Chromium binary; test actual 320px layout and keyboard/controls. This gate uses Node built-ins, not npm browser testing packages. Fix real defects.
3. **Resolve real npm packages / lockfile on Node 24:** use official registry and `npm install` in nested `examples/forms-query-vertical/react-client`, commit npm-generated lock, and run `npm ci`, `npm run typecheck`, `npm run build`; then root `npm ci && npm run verify:offline`.
4. **Mount real React tests for all 16 staged topics:** exercise library behavior, intentionally failing starters, 409/412 and idempotent response-loss, infinite cursor page resets, SSR hydration, keyboard a11y, color/contrast and reduced-motion.
5. **Promote verified eight-topic modules atomically:** to `src/content/lessons/`, `labs/`, metadata/MDX registries, package scripts and `docs/checkpoint.json`; do not count source drafts as published.
6. **Next curriculum batches:** NestJS 11 (32 topics), PostgreSQL 12 (40 topics), Prisma 13 + Supabase 14 (64 topics), then remaining tracks. Prioritize real runtime tests/denial boundaries over bulk generated drafts. Review dev-only security exception before **2026-12-02 UTC**.

## Persistent references

`AGENTS.md` · `docs/FORMS_QUERY_RESILIENCE_ACCEPTANCE.md` · `docs/FORMS_QUERY_16_STAGING_ACCEPTANCE.md` · `docs/CURRICULUM_FINISHING_ROADMAP.md` · `examples/forms-query-vertical/README.md` · `docs/checkpoint.json`.

Never equate source-authored, source-tested, mocked-transport tested, real-HTTP tested, React library typechecked, browser-qualified or production released.
