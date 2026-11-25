# F8.1/F8.2 — executable SQL candidate exports and manual persistence review packs

Baseline 4426eedcfc56d11219b1a508877cda6c2a23cb03. All 13 real module manifests and 642 expected source paths (624 topic files, 13 manifests, five fixtures) reconciled against complete Git tree. 338/889 published unchanged.

## Implemented

- npm run pack:persistence -- --plan all: in-memory export projection, source hash checks, no writes.
- npm run pack:persistence -- --export 12.01 (or all): materializes only into a new OS temporary directory, preserving exact source bytes as UTF-8 text and creating blank per-lesson review records. Output is not a live MDX registry or a publication projection.
- Every automated SQL package contains a standalone run-sql.mjs and source-bound fixture/starter/instructor/acceptance hashes. From its module directory, run node run-sql.mjs 12.01.01 with ACADEMY_ISOLATED_PG=YES and PG_TEST_URL pointing to a dedicated local PostgreSQL 17+ academy_test database owned/usable by a dedicated non-superuser without role creation, DB creation, replication or RLS bypass. Use only trusted checked-in source, not arbitrary modified bundles.
- All three existing PostgreSQL qualification entrypoints delegate execution to the shared runner. It strips inherited PG environment overrides, pins numeric loopback, keeps credentials out of argv, checks actual server/database/role, requires a named P0001 assertion after reaching the acceptance stage and checks instructor rollback completion. This is not a sandbox for untrusted SQL; review the trusted fixtures first.
- 30 SQL contracts, 10 PostgreSQL manual operations cases, 64 Prisma/Supabase manual integration cases. Eight SQL concurrency topics require independent concurrent-session review. Sixteen Supabase RLS/Storage topics require distinct authenticated user evidence. The 74 manual contracts export their source and acceptance instructions; no fake executable adapter or passing test.
- Node24.11.1: ten targeted tests passed, including injected subprocess responses and a real temporary-directory exported wrapper that refuses a tampered starter before any connection. No real SQL execution. Full checkout export/build and actual Prisma/Supabase installation remain blocked; local shell has no psql/Docker or registry resolution.

## Next

Run the full source checks and pack export on a complete checkout, then qualify each SQL topic on disposable PostgreSQL, fixing real SQL regressions. Build actual Prisma 7 generated-client and local Supabase integration workspaces with genuine lockfiles, red/green acceptance tests and no production credentials. Implement live review projections and guarded promotion only after real execution; keep P1/P2 first and the current release freeze intact.
