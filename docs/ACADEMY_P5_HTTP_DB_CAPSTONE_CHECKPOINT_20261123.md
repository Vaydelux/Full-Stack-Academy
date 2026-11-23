# P5 HTTP → PostgreSQL capstone checkpoint — November 23, 2026

## Delivered on feature branch

- Dependency-free teaching path for real HTTP requests to PostgreSQL via an opt-in `psql` adapter.
- Transaction-local server-resolved actor and PostgreSQL `FORCE ROW LEVEL SECURITY` on synthetic tenant documents.
- Isolated fixture: 3 synthetic users, two tenants, read-only role, locked record, membership revocation and document-derived upload intents.
- Explicit double opt-in, loopback/disposable target guard, database role preflight, random per-run schema and cleanup.
- 23 new real Node tests for adapter and HTTP behavior using a simulated repository; 25 optional genuine HTTP/PostgreSQL checks authored.
- No dependency/lockfile changes, no production database, no workflow trigger or Vercel setting changes.

## Honest evidence

**23/23 local Node 22 tests passed** in the working fixture, and GitHub content blobs were compared with the tested files. The 25 real PostgreSQL checks are **NOT executed**, because `psql`/PostgreSQL is unavailable here. Source checks are not proof of database security.

## Curriculum state

889 canonical = **338 published + 184 source-authored/unpublished + 367 unauthored**. No publication registry change.

## Next TODO

1. Run `npm ci && npm run test:p5-bundle && npm run verify:offline && npm run build` on a complete Node24 checkout.
2. Run `npm run qualify:p5:http-db` on a dedicated disposable PostgreSQL 17+ cluster, capture exact PostgreSQL output and fix any real SQL errors.
3. Add a genuine, locked `pg` connection pool + least-privileged production-style roles and an external identity-provider adapter in an independent example.
4. Add real private Storage and malicious-file quarantine testing, then browser/a11y and editorial review.
5. Publish in the existing P1→P2→P3→P4→P5 sequence only when each release gate is independently satisfied.

Deployment freeze remains in place. Do not call synthetic test cases production RLS certification.
