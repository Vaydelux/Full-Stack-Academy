# Full-Stack Academy — Engineering Handoff (2026-11-20)

## Exact source state and progress

- **Merged through PR #32**, commit `3096d703`. Current feature branch `feat/native-task-idempotency-ui-recovery-20261120` hardens the dependency-free native Forms/Query UI and its browser qualification gate.
- Curriculum source remains **28 tracks, 111 modules, 889 topics, 338 published unique lessons, 337 published MDX/lab manifests and 42 complete modules**.
- **551 unpublished canonical topics** remain. Of those, **16 React Hook Form 09.02 / TanStack Query 09.03** lessons are staged with MDX/metadata/red starter/instructor source; the other 535 have not been staged. Staged is **not** published.
- No GitHub Actions or Vercel checks. The education-only task server remains loopback-only, in-memory, unauthenticated and not deployable as a production public API.

## Current milestone implemented

- [x] Native browser form prevents a fresh POST while the outcome of the previous POST is unknown, preserving exact semantic payload and idempotency key for safe replay.
- [x] Retryable/ambiguous response-loss, 408, 429 and 5xx states retain key; terminal other 4xx responses clear it. Explicit Discard uncertain attempt warns about potential duplicates and only then unlocks a new create.
- [x] A confirmed 201 is not downgraded to an unknown result if the follow-up GET refresh fails.
- [x] One synchronous mutation lock serializes native POST, conditional PATCH and DELETE. Existing/new task buttons, refresh and Load More are disabled during writes. Lock release uses finally for unexpected exceptions.
- [x] Native UI markup and CSS add responsive Retry/Discard controls, touch targets and status messages.
- [x] Add nine-case `tests/forms-query-native-ui.test.mjs` exercising real event logic via a dependency-free simulated DOM and the actual loopback API in a Node checkout. Wired into `verify:offline` and Forms/Query source qualification.
- [x] Expand the separate real Chromium/Edge/Chrome CDP gate to **15 UI checks** using a pre-document, test-only fetch fault interceptor to exercise uncertain POST, terminal 422, committed POST + failed GET, stale cursor 409 and competing PATCH/DELETE.
- [x] Update project walkthrough, runbook, workbook, acceptance, checkpoints and AGENTS.

## Observed validation in this session

- [x] **9/9** exact-source native event scenarios passed in an isolated **simulated DOM/mock HTTP transport** evaluator. Scenarios include response-loss duplicate prevention and same-key retry, discard, 422, GET read failure, stale cursor recovery, 12-row pagination, write lock and journal privacy.
- [x] Native browser JavaScript, new Node test and CDP test-source grammar checks passed after handling ESM syntax.
- [x] The new Chromium fault-injection source was parsed independently, and required `#retry` and `#discard` markup IDs were verified.
- [x] PR #32 prior evidence: 20/20 typed client mocked HTTP, 12/12 policy and 11/11 source-wiring checks (historical).
- [ ] **Real latest Node HTTP socket run** on a complete checkout (including nine new native UI tests and existing typed API tests).
- [ ] **Real Chromium 15-case run** on actual native site; do not confuse the independently probed Chrome DevTools handshake with a successful site run.
- [ ] **Nested React Hook Form / TanStack Query** npm-generated lockfile, real `npm ci`, typecheck/build and DOM/keyboard test.
- [ ] **Root Node24** npm ci, verify:offline, 337+ labs, content contracts, lint/typecheck/Next production build.
- [ ] Real positive/negative React library/DOM test for each of the 16 staged lessons, SSR hydration, screen reader, zoom/mobile acceptance.

## Run on a full checkout

```bash
npm run test:forms-query-native-ui
npm run qualify:forms-query:source
npm run qualify:forms-query:browser

# After trusted real npm dependency installation and lockfile generation, Node 24:
npm run qualify:forms-query:full
```

## Larger next milestones, in strict priority order

1. **P0 Qualification of this source** — Run the true Node HTTP and Chromium gates locally, fix actual failures, and qualify the existing live frontend on 320px/tablet/desktop, keyboard, 200% zoom and screen readers.
2. **P1 Publish RHF + TanStack Query modules 09.02 and 09.03** — Install genuine libraries, generate the lockfile, check all 16 instructor samples, verify red starters genuinely fail, test Next hydration and promote one eight-topic module at a time only after the complete offline gate.
3. **P2 NestJS Track 11 (32 topics)** — Dependency-locked DI, guards, validation and real HTTP tests.
4. **P3 PostgreSQL Track 12 (40 topics)** — Real isolated Postgres, transactions, migrations, EXPLAIN, rollback and concurrency.
5. **P4 Prisma Track 13 and Supabase Track 14 (64 topics)** — Real clients, schema migrations, Auth and denial-first RLS. Then work through the remaining specialization and capstone tracks according to `npm run status:curriculum`.
6. Review historical dev-only dependency security exception before **2026-12-02 UTC**.

## Persistent context

Read `AGENTS.md`, `docs/FORMS_QUERY_NATIVE_UI_ACCEPTANCE.md`, `docs/FORMS_QUERY_RESILIENCE_ACCEPTANCE.md`, `docs/FORMS_QUERY_16_STAGING_ACCEPTANCE.md`, `docs/CURRICULUM_FINISHING_ROADMAP.md`, `docs/checkpoint.json` and `examples/forms-query-vertical/README.md`.

Never equate code authored, simulated request handler checked, real socket verified, true browser qualified, npm library typechecked or deployed. Do not publish an unqualified lesson ID or invent package integrity hashes.
