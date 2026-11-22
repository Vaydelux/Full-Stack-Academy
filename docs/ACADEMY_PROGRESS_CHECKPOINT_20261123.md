# Full-Stack Academy — P3 PostgreSQL Authoring Checkpoint

**Checkpoint date:** November 23, 2026  
**Branch:** `feat/p3-postgres-complete-1203-1205-20261123`  
**Release state:** Source-authored drafts only; no learner publication, Git build deployment, or real SQL performance/recovery certification.

## Measured and catalog progress

| Category | Count | Meaning |
| --- | ---: | --- |
| Canonical curriculum | **889** | Stable topic IDs, unchanged |
| Published, learner accessible | **338** | Existing published registry, unchanged |
| Authored but unreleased | **88** | P1 Forms/Query 16 + P2 NestJS 32 + P3 PostgreSQL 40 |
| Not authored | **463** | Canonical topics with no published lesson or draft manuscript |
| P3 PostgreSQL manuscript coverage | **40 / 40** | SQL Essentials, Relational Modeling, Transactions, Query Performance, Operations & Recovery |
| Newly authored in this milestone | **24** | 12.03.01–12.05.08 |
| New automated semantic SQL acceptance cases | **14** | Source-coded, not yet executed on real PostgreSQL |
| New manual-evidence labs | **10** | EXPLAIN, workload metrics, VACUUM, restore, replication, security and other operational work |

`338+88+463=889`. **Authoring completion is not publication completion.** Students still only have access to 338 released lessons. The existing `/learn/roadmap` computes its progress from staged metadata and the published lesson registry; this checkpoint is a historical source snapshot, not an API or a new learner score.

## What was implemented

### 12.03 — Transactions & Concurrency (8 lessons)

Atomic transfers, queue claims, tuple version diagnostics, optimistic concurrency, idempotency records, database uniqueness, audit/transaction boundaries and a deterministic lost-update simulation. Every lesson has two concrete SQL snippets (starter/instructor), a matching checked-in file pair, a named semantic acceptance assertion and a guided three-step MDX tutorial.

**Important:** All eight SQL contracts run with one database connection per case. They do not prove real competing transactions, isolation visibility or deadlock behavior. Independently run a two-session concurrency qualification before releasing lessons whose claims depend on concurrent workers. A sample two-session drill is in the P3 operator README.

### 12.04 — Query Performance (8 lessons)

EXPLAIN ANALYZE, composite indexes, partial/covering indexes, keyset pagination, N+1 diagnosis, connection budgets, VACUUM and a complete before/after slow-query investigation.

Four source-coded SQL contracts can check a specific index definition, cursor result or database setting. The other four **require measured/manual evidence**. PostgreSQL planner choices depend on data scale and statistics: **a source-only index or query-plan snippet must never be marked a performance win**.

### 12.05 — Operations & Recovery (8 lessons)

WAL/PITR concepts, streaming replicas, expand–backfill–contract migrations, live environment identity, least-privilege roles, connection poolers, restore drills and a sample recovery capstone.

Two source-coded SQL contracts check the temporary-fixture migration and the actual connection identity. Six operational lessons require real external evidence: separate test environments, backup artifacts, successful isolated restores, roles, replica state and measured recovery behavior. This work is *intentionally not automated* by the module-level SQL runner.

## Engineering quality repairs

- Fixed the **legacy 12.01 source verifier**, which wrongly counted every PostgreSQL draft directory as if only 12.01 existed. Counts now apply to module-specific 12.01 source files and lab slugs. This is an existing regression that would otherwise break `verify:offline` as the track expands.
- Repaired 12.04.04's starter cursor to fail the intended page assertion rather than accidentally match the solution.
- Simplified the 12.03.02 queue claim SQL into an UPDATE and observable table snapshot to avoid a fragile data-modifying CTAS formulation.
- Added a shared 12.03–12.05 offline inspector that rejects wrong canonical IDs, inconsistent MDX SQL fences, bad lab paths, premature publication flags, missing official references, repeated slugs, and missing manual proof markers.
- Added an explicit local-only `psql` qualifier that refuses remote connections and non-test database names, requires `ACADEMY_ISOLATED_PG=YES`, runs a fresh rollback-only transaction for each variant, and accepts **only named semantic failures** from intentionally red starters.
- Updated the publication phase integration test to require all 40 P3 drafts and **338/88/463** counts without changing `data/curriculum.json` or any published lesson registration.
- Left the existing private learner progress dashboard untouched; staging metadata must not unlock a lesson or update learner completion.

## Verification actually performed

- All 24 lesson packs were committed to GitHub source on a single feature branch.
- The core archive is designed for 24 lessons, 14 automated SQL semantic contracts and 10 manual-evidence items.
- Direct source/inventory and JS syntax checks are possible from the tools in this session. They do not exercise actual PostgreSQL statements or the Next app runtime.
- This environment has **Node 22.16**, no `psql`/PostgreSQL service, no cloned Git working tree, and outbound npm/GitHub DNS unavailable to the local shell. Therefore a full root `npm ci`, Node24 Next build, browser test, real SQL concurrency scenario, recovery drill and accessibility review **remain unexecuted**.

Do not treat the committed Node tests or SQL acceptance source as passed runtime checks unless independently executed and recorded.

## Reproducible commands

On a clean Node 24 checkout, with normal registry access:

```sh
npm ci
npm run test:postgresql-p3-source
npm run test:postgresql-drafts
npm run test:postgresql-modeling-source
npm run test:publication-phases
npm run test:course-roadmap
npm run verify:offline
```

Only after setting up a dedicated local PostgreSQL 17+ `academy_test` database and least-privileged disposable user:

```sh
export ACADEMY_ISOLATED_PG=YES
export PG_TEST_URL='postgres://academy_tester:LOCAL_TEST_PASSWORD@127.0.0.1:5432/academy_test'
npm run qualify:postgresql:12-01
npm run qualify:postgresql:12-02
npm run qualify:postgresql:p3
```

On Windows PowerShell set the same variables with `$env:ACADEMY_ISOLATED_PG='YES'` and `$env:PG_TEST_URL='postgres://...'`. Never commit the real password, shell history with secrets, or private DB output.

Even a fully passing `qualify:postgresql:p3` covers **14 semantic source cases** and explicitly skips **10 manual evidence cases**. It does not satisfy the independent multi-session concurrency test, plan benchmarking, backup/restore, screen reader, browser, or accessibility requirements.

## Next handoff

1. Run the source gates on the exact merged checkout; fix any observed failures.
2. Run all real PostgreSQL semantic gates against the disposable local instance; troubleshoot real SQL faults rather than claiming source success.
3. Complete manual two-session concurrency, EXPLAIN data-size, vacuum, role, replica and recovery proof packages with exact environment and sanitized evidence.
4. Run Next production build, browser smoke, keyboard and human screen-reader/zoom/reduced-motion checks. Keep the Vercel automatic Git deployment freeze until a controlled release is approved.
5. Only then promote individually qualified lessons from drafts into the real published registry in the established P1 → P2 → P3 release order.
6. Start authoring P4 Prisma/Supabase topics next without increasing the published count based on manuscript completion.

**Freeze assertion:** `vercel.json` retains `git.deploymentEnabled=false`; GitHub Actions remains `workflow_dispatch` only. The merge is a source merge, not a deploy.
