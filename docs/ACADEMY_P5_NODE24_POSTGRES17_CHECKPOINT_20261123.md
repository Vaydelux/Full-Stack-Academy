# P5 reproducible database qualification — 2026-11-23

## Completed source implementation

- New `examples/p5-security/container/`: Docker Compose isolation, PostgreSQL 17 disposable tmpfs-backed server, nonsuperuser lab role, Node 24 container, network sharing without host ports, readonly repository mount, orchestration runner, and nine Node regression tests.
- New `npm run qualify:p5:container` runs all P5 source and three real database qualification commands, failing closed on any error or incomplete project cleanup.
- Hardened the existing HTTP-to-PostgreSQL `qualify.mjs`: concurrent cross-tenant reads, checks after membership revocation, authorized owner deletion, and cleanup attempts even when database setup partially fails.
- Made `cleanup.sql` idempotent with `DROP SCHEMA IF EXISTS`, scoped to the existing random `p5h_` schema.
- Added `test:p5-container-source` into the default P5 test bundle, without modifying dependencies, application runtime, published lesson registry, production database, workflow triggers, or Vercel deployment settings.

## Actual evidence

- Locally executed existing P5 HTTP and hardening tests: **39/39 passed** on Node **22.16.0**.
- Locally executed new container wrapper/source tests: **9/9 passed** on Node **22.16.0**.
- Parsed the Compose YAML locally; Dockerfiles, SQL and runner code were inspected. Confirmed staged GitHub blob hashes match locally tested and modified files.
- Verified Docker, PostgreSQL and `psql` are absent from the current runtime. **No actual Node 24 container, PostgreSQL 17, `psql` RLS, full Next.js build, identity provider or browser/a11y check has passed here.**
- These 48 individual local tests belong to two targeted suites, not to the full repository's `test:p5-bundle`, which has not run against a complete Node 24 checkout.

## Curriculum and release state

889 canonical: **338 published**, **184 source-authored but unpublished**, **367 unauthored**. The P5 public reader remains unchanged and `vercel.json` still has `git.deploymentEnabled=false`. GitHub Actions remain manually initiated.

## Next accepted milestone

1. On a Docker-capable workstation run `npm run qualify:p5:container`, capture the **actual** Node 24 and PostgreSQL 17 logs, and fix any real SQL/runtime defects.
2. Reproduce `npm ci`, `npm run verify:offline`, `npm run build`, and browser/accessibility checks in the exact checkout.
3. Replace `psql` per request with an independently tested, least-privilege **pooled** PostgreSQL client (with genuine native lockfile), including concurrent identity-to-RLS propagation and transaction rollback on failures.
4. Complete real uploaded-PDF byte validation, quarantine, and storage authorization before publishing P5.
