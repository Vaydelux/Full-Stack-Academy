# Full Track 10 — Security Boundaries, OpenAPI 3.1 and generated client acceptance

**Checkpoint:** 2026-11-19 · **Branch:** `feat/backend-security-openapi-complete` · **Base:** draft PR #24 head `0c4530d6d3afc1af72ac40a652757c0ef76fbb86`. PR #24 itself depends on #23→#22→#21→#20.

## Large development milestone delivered in source

Together with prior PR #24, **all 32 Track 10 lessons are now authored**:
- `10.01` Node Runtime (8 lessons, PR #24)
- `10.02` HTTP API Fundamentals (8 lessons, PR #24)
- `10.03` Security Boundaries (8 new lessons)
- `10.04` OpenAPI & SDKs (8 new lessons)

Each of the 16 new lessons has canonical ID, MDX content, three guided implementation steps, strict metadata, official references, quiz, misconception, bug-hunt, documented security boundaries, local lab manifest, intentionally defective learner starter, corrected instructor code, and Node.js built-in acceptance tests. **96 new lesson/lab assets** exist.

### Security/HTTP boundary coverage (10.03)

- Trust forwarding headers only from a designated trusted proxy—not from arbitrary users.
- CORS exact-origin policy vs independent CSRF state-change checks; neither grants backend permissions.
- Secure/HttpOnly/SameSite __Host- session cookie serialization; no claim to generate or verify real sessions.
- Sliding-window request limiting per actor as a local teaching model, not a distributed enforcement service.
- Enforced declared and actual streamed body byte limits, plus mismatch denial.
- SSRF URL allowlist against schemes, credentials, IP literals, lookalike hosts and custom ports. **Not complete SSRF defense**: DNS rebinding, redirect prevention and enforced network egress must be separately covered.
- Nested sensitive log field redaction, with guidance to allowlist fields instead of relying only on key names.
- Real Node `http` loopback capstone requiring a demo bearer token and validating JSON bodies with safe RFC 9457 Problem Detail errors.

### OpenAPI/SDK coverage (10.04)

- OpenAPI Specification **3.1.1** document structure and JSON Schema 2020-12 boundaries.
- GET/POST request/response media types, status codes, reusable schemas and explicit per-operation bearer security.
- Unique safe `operationId` checks; bounded compatibility regression checks; explicit versioned Accept media policy.
- Actual checked-in source `examples/task-contract/task-api.openapi.json`, real minimal generator `examples/task-contract/generate-client.mjs`, and loader.
- The generator supports trusted **static** GET/POST paths only, validates safe operation IDs, injects bearer tokens at **runtime** (never embeds credentials), rejects redirects and exposes fetch-based client methods.
- The final capstone generates an ES module client from the contract and uses actual `fetch` against the 10.03 loopback HTTP API, testing health, authenticated list/create, unauthorized rejection and invalid payloads.

## Actual runtime evidence (exact GitHub Git blobs)

The current container has **Node.js 22.16.0**, not the course's target Node 24. A focused harness copied GitHub sources, verified exact SHA-1 Git blob hashes, then executed tests.

| Test | Exact copied Git blobs | Result |
|---|---|---|
| OpenAPI generated SDK + HTTP capstone instructor | `generate-client.mjs de988fe8`, `load-spec.mjs d58ac4e1`, `task-api.openapi.json 51b9e70f`, `security demo solution 058bff48`, `OpenAPI capstone solution b88e4295`, `OpenAPI test 1fb3f877` | **1/1 passed**, real local listener |
| OpenAPI deliberately broken starter | `starter c44d22c2` + same test | Exit nonzero, `ERR_ASSERTION`, as expected |
| Security endpoint instructor | `solution 058bff48`, `solution.test.mjs a58aa190` | **1/1 passed**, real local listener |
| Security deliberately broken starter | `starter a2b50e8a` + same test | Exit nonzero, `ERR_ASSERTION`, as expected |

The checked-in files were verified byte-for-byte by `git hash-object` before testing. **Only these two new instructor capstones and their two red counterparts have been executed**. The other 14 new instructor/red tests, full Next/TypeScript/content/lockfile checks and Chromium tests remain unexecuted.

Previous PR #24 also recorded an exact local Node 22 HTTP core capstone pass, but this is not a substitute for the complete Node 24 release gate.

## Source audit

- GitHub tree audited without truncation; all 16 new MDX/meta/manifest/starter/solution/test groups are present
- All 16 articles inspected for canonical IDs, official references, three guided steps, quiz, rubric, bug hunt, and lab gates
- Source candidate totals after all stacked branches: **338 unique published IDs, 337 MDX lessons, 337 local lab manifests, 42 complete modules**, 38 authored reference drafts of 303 indexed subjects, 889 canonical topics total (551 still planned)
- The preexisting four interactive model IDs overlap with three MDX records; published IDs are recalculated by **set union**, not naive summation
- Fixed five older suite files so milestone-specific coverage thresholds do not pin a stale global count as the curriculum grows

## Full release gate — NOT EXECUTED

On a complete checkout of this exact PR stack with **Node 24** and a trustworthy lockfile:

```bash
npm ci
npm run test:backend-contract
npm run test:red-backend-contract
npm run verify:offline
```

Run the isolated local Next/Chromium smoke including `scripts/backend-contract-track-smoke.mjs`, verifying all 16 new authored routes, sitemap, noindex at still-planned `09.02.01`, and 320px overflow. Also test keyboard navigation, screen-reader behavior, course progress, theme contrast, console warnings, and reduced motion. **No Vercel or GitHub Actions checks**.

Source inspection and the two targeted runtime suites do not certify production-readiness or OpenAPI 3.1 compliance with a full parser. The local demo is intentionally unauthenticated for distinct human users, single-process, in-memory, localhost-only and unsuitable for public deployment.

## Remaining critical path

1. **Converge the stacked source PRs** #20 → #21 → #22 → #23 → #24 → this PR. After each accepted PR, rebase the next and rerun exact-head local gates. Never assume a clean GitHub mergeability flag replaces actual checks.
2. Backfill missing **09.02 React Hook Form** and **09.03 TanStack Query** with real lockfile-pinned package installations and mounted integration tests; those remain unpublished despite later modules being authored.
3. Next large cohesive stack: **11.01–11.04 NestJS** (32 lessons), followed by **12.01–12.05 SQL/PostgreSQL** (40), and **13.01–14.04 Prisma/Supabase** (64) with actual schema migrations, RLS tests, and dependencies. Do not claim those future modules implemented before runnable evidence.
4. Prior historical dev-only Picomatch advisory exception should be re-reviewed before **2026-12-02 UTC**.

## Primary handoff

Read `docs/NEXT_TODO.md`, `docs/checkpoint.json`, `AGENTS.md`, `docs/LARGE_SCOPE_DELIVERY_PROGRAM.md` and this acceptance file before continuing.
