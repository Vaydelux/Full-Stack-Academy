# Full-Stack Academy — Active handoff (2026-11-19)

## Repository source truth

- `main`: `651fb296` following earlier owner-approved PRs #17–#19.
- Draft PR stack: **#20 Next 07.02–07.05 → #21 UI 08.01–08.04 → #22 Zod 09.01 → #23 Zustand 09.04 → current `feat/node24-http-api-vertical-slice` 10.01–10.02**.
- Proposed source totals when all stack layers are included: 322 unique published lesson IDs, 321 MDX lesson bodies, 321 local lab manifests, 40 complete modules, 38 reference drafts/303 indexed subjects. 567/889 remain planned.
- First unauthored canonical ID still **09.02.01**; Node 10.01–10.02 is an intentional independently executable out-of-order increment.
- Source count is not live deployment status. No Vercel or GitHub Actions checked.

## This delivery: Node 24 and REST APIs

- [x] 16 canonical lessons with 3 guided steps each, source metadata, quiz, misconception, bug hunt, rubric, red starter, working instructor and official API sources
- [x] Node 10.01 includes actual microtask ordering, environmental bounds, stream byte budgets, Fetch/AbortSignal, filesystem realpath, process metrics, lifecycle cleanup and streaming SHA-256 upload
- [x] HTTP 10.02 includes RFC 9110 verbs, Accept negotiation, bounded JSON, idempotency, global sort/filter/page, RFC 9457 errors, ETags and **real local http server capstone**
- [x] Local Node 22 integration run: instructor capstone test **1/1 pass**, manual 400/400/400/422/413 response probes. The expanded checked-in capstone test has not been re-run.
- [x] Registered all MDX and metadata, per-lab commands, independent Node test script and 16-case red-starter assertion guard; content schema supports `lab.node.*` and `lab.http.*`
- [x] Added source integrity suite and local Next/Chromium route/sitemap/mobile smoke script

## Remaining P0 verification

- [ ] On a real Node 24 full checkout, `npm ci && npm run verify:offline`
- [ ] Exact-head `npm run test:node-http` and `npm run test:red-node-http`; confirm all 16 instructors pass and all 16 broken learners fail `ERR_ASSERTION`
- [ ] Run local Chromium browser smoke for the 16 authored Node/HTTP pages (320px, noindex, sitemap, accessibility)
- [ ] Qualify and converge stacked drafts in dependency order; do not merge based solely on text or source checks
- [ ] Reassess historical dev-only Picomatch exception before **2026-12-02 UTC**

## Next larger pass

- [ ] 10.03–10.04 Security Boundaries / OpenAPI & SDKs — 16 lessons, actual security/API-contract integration tests
- [ ] Next large slices: Nest 11.01–11.04 (32), SQL 12.01–12.05 (40), Prisma/Supabase 13.01–14.04 (64)
- [ ] Backfill 09.02 RHF and 09.03 TanStack Query with **genuinely installed and lockfile-pinned** dependencies, rather than mocked framework APIs
- [ ] Grow 38/303 authored reference drafts while preserving the reading-first UI, browser-only practice and quick-reference distinctions

**Continue from** `docs/NODE_HTTP_VERTICAL_ACCEPTANCE.md`, `docs/LARGE_SCOPE_DELIVERY_PROGRAM.md`, `docs/checkpoint.json`, `AGENTS.md`.
