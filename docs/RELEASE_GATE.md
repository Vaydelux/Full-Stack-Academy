# Full-Stack Academy — Local Release and Publication Qualification

**Current audit: 2026-11-24.** This document supersedes its previous 2026-11-18 baseline text. It is a release contract, not an attestation that the gate has completed.

## Verified source-of-truth inventory

- **28 tracks, 111 modules and 889 canonical topics.**
- **338 published unique lesson IDs** (337 published MDX and one distinct interactive publication), **551 unpublished authored drafts**, **0 not yet authored**.
- Source-only chapters, code labs, local HTTP fixtures and PostgreSQL SQL scripts **are not published lessons** until all of their publication gates pass.
- `docs/checkpoint.json` records the last verified historical hosted application baseline separately from ongoing unreleased source work.

## Mandatory release qualification (offline and Node 24)

1. Checkout the exact candidate Git SHA on a clean local machine with an actual Node 24.x runtime, npm and compatible lockfiles; record the tested commit.
2. `npm ci`, then `npm run test:release-gate-coverage` and `npm run verify:offline`. The offline runner includes all **20 required P5 source/HTTP/security/durability/concurrency/database-source subchecks** via `npm run test:p5-bundle`, plus prior-phase tests, lint, typecheck, and production build. Any missing script or failed command must stop the gate.
3. Run real isolated PostgreSQL 17+ opt-in qualification for the SQL labs, and a genuine NestJS/Prisma/Supabase runtime with least-privilege, real authorization and denial cases. A mocked SQL test or an in-memory model does not count as database acceptance.
4. Validate P1 RHF/TanStack Query and P2–P5 real dependency lock integrity, positive and negative starter behavior, and server-side rendering/hydration.
5. Run browser smoke against the built app, keyboard navigation, mobile/TV or specified responsive viewports, 200% zoom, and **human screen-reader review**. Automated source assertions do not constitute accessibility signoff.
6. Audit actual provider-specific webhook signatures, DNS/authenticated transactional email, storage scanning/quarantine, durable outbox/inbox and crash/restart behavior before promoting those topics.
7. Publish only an entire validated eight-lesson module via an atomic reviewed promotion. Both lesson registries, labs, metadata, index/sitemap, checkpoint and deployed content must reconcile exactly. Separate publication from curriculum planning and learner progress.

## Freeze and security

- `vercel.json` deliberately keeps `git.deploymentEnabled=false`. Do not re-enable, deploy, run Actions or claim a hosted release from a source-only merge.
- The track-18 webhook teaching protocol signs the exact body, timestamp, provider **and event ID** with an explicitly versioned HMAC envelope. It is **not** a compatible replacement for an external provider's own signature specification. A real adapter must use the vendor's documented algorithm.
- A local HTTP server with synthetic sessions is not a production identity provider, and in-memory queues cannot guarantee durable delivery or exactly-once external side effects.
- Review existing dependency-audit exceptions before their recorded expiration. The prior dev advisory exception expires **2026-12-02 UTC** and must not be silently renewed.
- Do not run deliberately untrusted learner code on the trusted Next origin. Preserve isolated preview execution, private data boundaries, and local-first, free-tier-conscious fixtures.

## Honest current evidence

The 2026-11-24 local multiprocess milestone executed **58/58 targeted Node 22 tests** (35 existing inbox, eight new interprocess/concurrency/commit-failure tests, 15 release-matrix tests) on an isolated reconstruction using the exact new inbox/test source blobs and a test-only `signWebhook` implementation matching the synthetic HMAC envelope. This is **not** a complete repository or integration test run. The previous 2026-11-23 milestone separately recorded **170/170** local source/HTTP/inbox tests; these results were not all re-executed now.

The offline release gate still intentionally requires **Node 24.x**. Actual PostgreSQL SQL, genuine multi-host/distributed concurrency, full 889-topic source content checks, Next production build, vendor protocols, and human accessibility remain unverified. Do not promote unpublished topics or re-enable Vercel Git deployments based on these source-only tests.

A failed or missing `<store>.lock` release leaves the local inbox blocked rather than reclaiming ownership from a possibly alive process. Operator recovery requires all writers stopped and independent verification, not TTL-based automatic lock removal. See `docs/ACADEMY_P5_MULTIPROCESS_LOCK_CHECKPOINT_20261124.md`.

## 2026-11-24 P5 transactional PostgreSQL source addition

The P5 offline matrix now mandates a **20th source-only group**, `npm run test:p5-postgres-inbox-source`, covering 70 local Node22 tests for the new opt-in PostgreSQL-backed teaching adapter, SQL/schema guard and live-runner configuration. These tests include a mocked pg-compatible pool; **they are not evidence of actual PostgreSQL execution, RLS correctness or multi-connection DB concurrency**. The separate `qualify:p5:inbox-sql` and `qualify:p5:inbox-live` commands are opt-in, require a disposable local PG17+ database and affirmative confirmations, and have not been executed here. A successful Node24 release gate still depends on the clean full checkout, complete Next build, browser/accessibility and real vendor qualification. No publication or Vercel deployment triggered. See `docs/ACADEMY_P5_POSTGRES_INBOX_CHECKPOINT_20261124.md`.

## Commit-bound local qualification coordinator (2026-11-24)

`npm run qualify:academy:local -- --plan` inspects the current checkout without executing qualification commands; `--plan-p1` scopes the plan to the Academy/P1 automated gates. Use `--run-p1` or `--run` explicitly to execute. Both require stable Node 24.9+ within the 24.x line, a clean Git worktree, tracked root and React-client npm lockfiles, a resolvable Playwright installation specified by `ACADEMY_BROWSER_ROOT`, and a normal npm CLI invocation. The all-profile additionally requires the currently **missing NestJS npm lockfile**. Do not create a fabricated lock.

The coordinator runs existing repository-owned commands in a fixed order, checks the commit and selected lockfile hashes before and after each gate, and updates a JSON receipt in a temporary directory outside the checkout. On command failure or checkout change it stops; later gates remain not-run. The P1 profile includes the full Academy local gate, dependency audit and specific RHF/Query browser gates, but skips the dependency-installed NestJS architecture gate. That skipped gate remains explicitly not-run.

A receipt is local diagnostic evidence, **not signed or tamper-proof attestation**. It cannot approve publication and does not replace actual DB/provider tests or manual reviews. The npm dependency audit and npm ci need legitimate registry access; the tool is local execution, not an air-gapped guarantee. Keep an isolated worktree and prevent concurrent edits; Git clean checks do not prove absence of malicious local modification or ephemeral changes. Command timeout may leave descendant processes; inspect and stop those before rerunning. See the checkpoint for setup, scope and limitations.

## P6 Testing and Delivery source coverage (2026-11-24)

`npm run test:p6-quality-source` verifies canonical Track 19/20 source manuscripts and executes local model and auditor tests. It is included in `verify:offline`. The shared draft inventory reads both older metadata-paired manuscripts and newer frontmatter-only manuscripts rather than relying on a hardcoded folder list. Historical source manuscripts retained after publication do not count as unpublished.

The 64 new topics remain **draft-unverified**, including their model exercises. Real React/Vitest/Testing Library/MSW/browser behavior, NestJS/database integration, k6 traffic and thresholds, Docker/Compose isolation, actual CI/artifact provenance, deployment/rollback, Linux/TLS/DNS and IaC require independent evidence. The local model cannot certify those tools. No Actions workflow or deployment configuration is added or enabled.

## P6 Operations and Architecture source coverage (2026-11-24)

`npm run test:p6-operations-source` is included in `verify:offline`. It audits the 80 Track 21–23 manuscripts and executes ten teaching models and source-auditor fixtures. All 144 P6 topics now have source manuscripts; none is promoted by these checks. Actual OpenTelemetry/Pino/Sentry, SRE fault and restore drills, browser performance, database/HTTP benchmarking, cache and broker semantics, real code dependency analysis and distributed recovery require separate qualification. No model pass is evidence of actual runtime integration or production reliability.

## P7 final manuscript coverage (2026-11-24)

`npm run test:p7-source` audits the 136 canonical P7 drafts and executes local model/fixture tests. All three P6/P7 source groups are required by the release-matrix auditor. Actual native platform builds, SQLite durability, real analytics/vector/spatial databases, media pipelines, identity and payment providers, independent privacy review and all capstone runtimes remain unqualified. The capstone assessment rubric does not certify graduation. Authoring inventory is complete; no publication, deployment, dependency lock or hosted workflow changes were made. The draft-overlap guard intentionally requires an explicit reviewed update during future module promotion. Reference URLs have not been independently checked for current availability or version applicability.

## P1 HTTP resilience regression gate (2026-11-24)

`npm run test:forms-query-resilience` is mandatory in the offline matrix and both suites are included in `qualify:forms-query:source` and `--full`. The in-memory teaching server retains up to 200 accepted create keys without eviction; denied new writes return 409, and replay returns the historical 201/Location even after deletion. This is intentionally single-instance memory, not a durable production guarantee. Reproduce 413 for oversized chunked bodies, 415 for unsupported encoding, 400 for malformed UTF-8/unsafe numeric cursor, 412 for competing revision writes, and intentional read cancellation without retry. No full publication qualification inferred.
