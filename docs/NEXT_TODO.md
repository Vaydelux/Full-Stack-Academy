# Full-Stack Academy — Active development handoff (2026-11-19)

## Source state, not hosted state

- `main` previously merged through owner-approved PRs #17–#19 and is not currently on this source branch.
- Draft stacked milestone chain: **#20 Next.js 07.02–07.05 → #21 UI 08.01–08.04 → #22 Zod 09.01 → #23 Zustand 09.04 → #24 Node+HTTP 10.01–10.02 → current `feat/backend-security-openapi-complete` Security+OpenAPI 10.03–10.04**.
- Proposed candidate snapshot after the six stacked layers: **338 distinct published IDs, 337 MDX lessons, 337 lab manifests, 42 completed modules, 38 authored reference drafts/303 indexed topics**. The 889-topic catalog has **551 still planned**.
- **Full Track 10, all four modules (32 lessons), is source-authored** across #24 and current branch. `09.02.01` remains the **first unauthored canonical** lesson due to missing real React Hook Form and TanStack Query dependencies.
- No Vercel or GitHub Actions was checked. These source totals are **NOT** the live production website.

## Delivered in current large-scope pass

- [x] `10.03.01–10.03.08`: trusted proxies, CORS/CSRF, cookie hardening, sliding-window limiter, streamed body limits, SSRF allowlist with explicit DNS/egress disclaimer, structured redaction and secure demo endpoint
- [x] `10.04.01–10.04.08`: OpenAPI 3.1 structure, request/response semantics, bearer security schemes, IDs/examples, actual generator, compatibility checks, version strategy and live generated-client capstone
- [x] All 16 articles have complete metadata, lab manifests, broken learner code, instructor code, 3 guided steps, quiz, misconception, official docs and completion rubrics
- [x] Real checked-in OpenAPI 3.1.1 JSON + restricted JS generator + local bearer-demo HTTP server with actual cross-module HTTP tests
- [x] Published/route registries, per-lab scripts, independent security+OpenAPI test script, strict red starter suite, source checks and local Chromium route smoke contract
- [x] Fixed stale cumulative-count checks in 5 older suite files; exact global checkpoint remains separately audited
- [x] GitHub source tree counts confirmed and all 16 metadata/MDX structures inspected
- [x] **Actual Node 22 execution**: exact SHA-matched security and generated-client instructor capstones **2/2 passed**, corresponding red starters both failed with `ERR_ASSERTION`

## What is NOT verified

- [ ] Remaining 14 new instructors and 14 red learners as executable Node 24 tests
- [ ] Full `npm ci && npm run verify:offline` on the exact head, including lint/tsc/content/checkpoint, 337 lab files, all red starters and Next build
- [ ] Local Next+Chromium/browser checks, keyboard, 320px, screen reader and responsiveness
- [ ] Full OpenAPI JSON Schema conformance; the generator intentionally supports only trusted static GET/POST endpoints
- [ ] Production security (human identities, tenant authorization, secret management, TLS/egress, rate limits, persistent storage, audit logging)
- [ ] Owner-approved qualification/rebase/merge convergence across draft PRs #20–#25
- [ ] Review historical dev-only Picomatch exception before **2026-12-02 UTC**

## Next genuinely large milestones

- [ ] **Consolidation:** qualify PR #20 first with Node 24 and merge sequentially, rebase/retest each successor
- [ ] **Block A:** 09.02 React Hook Form + 09.03 TanStack Query (16 topics) with real packages and a new lockfile, controlled mounted React integrations and error-state tests
- [ ] **Block B:** NestJS 11.01–11.04 (32) with real `@nestjs/*` packages, DTO validation, pipeline, auth boundaries and HTTP tests
- [ ] **Block C:** SQL/Postgres 12.01–12.05 (40), real DB migrations, concurrency and recovery evidence
- [ ] **Block D:** Prisma/Supabase 13.01–14.04 (64) with verified RLS denial cases, Auth and migration checks

**Source handoff:** `docs/TRACK10_SECURITY_OPENAPI_ACCEPTANCE.md`, `docs/LARGE_SCOPE_DELIVERY_PROGRAM.md`, `docs/checkpoint.json`, `AGENTS.md`. Do not open more unverified stacked PRs until a locally qualified merge plan reduces the six-layer risk.
