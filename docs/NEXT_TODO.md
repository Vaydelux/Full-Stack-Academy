# Full-Stack Academy — Current development handoff (2026-11-20)

## Source state and genuine qualification

- Owner-authorized PRs **#20–#29** have merged into `main`. The latest v3 feature branch adds a source-only larger milestone around the real local Forms/Query capstone; its PR will be merged separately.
- Core catalog remains exactly **889 canonical topics in 111 modules and 28 tracks**, with **338 published unique IDs, 337 MDX lessons + 337 local lab manifests, 42 completed modules and 38 authored references**. The 16 09.02/09.03 topics are still PLANNED.
- Available from academy `/learn/projects` and `/learn/projects/forms-query`: a guided **local-only** task workflow, runbook and tests. The page itself does not run an unauthenticated API on the Next server.
- No GitHub Actions or Vercel inspections. No npm registry/GitHub clone DNS in the model's local runtime and no complete root Node 24 install/Next build or nested React typecheck/browser run. **A source merge is not release qualification.**

## v3 work implemented

- [x] Strict loopback Host validation before static/API routing, Origin and Fetch Metadata cross-site denial, absolute/network-path request-target rejection
- [x] RFC-compatible application/problem+json responses
- [x] Task status todo/doing/done and per-task strong revision ETag
- [x] GET-by-ID; conditional PATCH status requiring If-Match; 412 conflict/428 missing precondition
- [x] Post-await atomic revision comparison so competing requests cannot both commit a stale edit
- [x] Status-filtered list queries, revision/filter-scoped pagination and strict query shape; writes invalidate old cursors
- [x] Browser-native task state transitions, filter and bounded metadata-only request journal
- [x] Standalone nested genuine RHF/TanStack React source with filtered query keys, typed status mutations and optimistic rollback; local Vite proxy trusted Origin translation
- [x] Complete OpenAPI 3.1.1 contract for six operations and corresponding contract assertions
- [x] Internal unindexed Practice Projects list/detail routes, linked from curriculum/DocShell
- [x] New root scripts in local `verify:offline`: workflow, contract and route checks
- [x] Updated runbook, workbook, acceptance, checkpoint and AGENTS.md

## What was actually checked

- [x] 29/29 workflow cases against committed JavaScript source in an **isolated mocked HTTP request/response harness** (including a two-writer conflict)
- [x] 11/11 exact-source OpenAPI contract checks
- [x] 6/6 exact-source project route and boundary checks
- [x] JavaScript syntax parsing of API/client/browser/test source, with a found test syntax error corrected before final run
- [ ] **Real Node 22/24 HTTP suite on v3 branch**; 22 real HTTP tests passed previously on PR #29, but not re-executed against v3 changes
- [ ] Real browser UI (native and nested React), keyboard/200% zoom/320px/screen reader, Vite Host/Origin proxy POST and 412 recovery
- [ ] Root `npm ci`, lint/typecheck/Next build, exact 337+ lab/negative gates, Node 24 supported runtime
- [ ] Nested React npm install, actual npm-generated lockfile, real typecheck/build and integration tests

See [v3 acceptance](FORMS_QUERY_WORKFLOW_V3_ACCEPTANCE.md) for detailed evidence and exact commands.

## Prioritized next milestones

1. **P0 Real network and browser qualification:** Full Node 24 checkout, `node --test tests/forms-query-*.test.mjs` (or the script names), `npm ci && npm run verify:offline`; verify Vite proxy and browser flows, remove actual defects. No hosted/Actions test gate needed.
2. **P1 Publish React Hook Form 09.02 and TanStack Query 09.03 (16 canonical topics):** resolve compatible dependencies and lock with npm; complete per-topic MDX, metadata, instructor/negative starter, lab fixture, rubric, real library/browser tests. Keep unqualified topics PLANNED/noindex.
3. **P2 Next NestJS Track 11 (32 topics):** real locked Nest package integrations, DI, request pipeline, validation, security boundaries and loopback tests.
4. **P3 PostgreSQL Track 12 (40 topics):** actual local DB harness, transactions, migrations, EXPLAIN, rollback and concurrency checks.
5. **P4 Prisma/Supabase Tracks 13–14 (64 topics):** actual generated client, schema migrations, Auth and denial-first RLS tests with audited boundaries.
6. Review the historical dev-only **Picomatch security exception before 2026-12-02 UTC**.

## Persistent project boundaries

- Task API is educational single-process in-memory with NO users, tenant isolation, persistence, TLS, durable idempotency or rate limits. **Never expose it on the public internet.**
- The React sample is a separate Vite project, not imported into production Next, until real packages/build/browser checks succeed.
- Do not fabricate npm integrity hashes or claim 16 workbook drafts are published lessons.
- Keep source-authored, local unit/simulation checked, real HTTP tested, browser qualified, and production released as distinct states.
- Source truth: `AGENTS.md`, `docs/checkpoint.json`, `docs/FORMS_QUERY_WORKFLOW_V3_ACCEPTANCE.md`, `examples/forms-query-vertical/README.md`.
