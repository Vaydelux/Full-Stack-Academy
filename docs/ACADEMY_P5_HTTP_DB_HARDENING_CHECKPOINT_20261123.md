# P5 HTTP–PostgreSQL hardening checkpoint — November 23, 2026

## Code changes

1. Separated fixture administrative membership revocation from ordinary document repository actions and introduced `revoke.sql`; HTTP callers cannot revoke tenants or sessions by invoking the document API.
2. Added synthetic logout with server-side session revocation and cross-origin rejection.
3. Added inactive-user and deleted-record fixtures and aligned upload-intent SQL with account status, active membership, role, deleted and locked checks.
4. Tightened the real connection preflight to check PostgreSQL 17+, `row_security=on`, expected database name, no superuser and no `BYPASSRLS`.
5. Added 16 adverse-path Node tests and updated the original 23 tests to exercise the separate fixture admin boundary.
6. Expanded optional real HTTP/PostgreSQL acceptance to cover suspension, deleted-record upload denial, logout/replay, and administrative revocation. These checks require genuine `psql` and a disposable PostgreSQL 17+ instance.

## Verification evidence

- Verified on Node 22.16.0 with `node --test` against the isolated, original-source-matched local P5 fixture: **39/39 HTTP/source/adversarial Node tests passed**.
- All touched `.mjs` files passed `node --check`.
- `qualify.mjs` without explicit disposable confirmations exits with a refusal instead of attempting PostgreSQL.
- **NOT VERIFIED:** actual PostgreSQL, RLS, SQL syntax execution, Node 24 full checkout, Next build, browser/human accessibility, real external identity provider, real upload bytes or malware quarantine.
- Do not interpret source/mock test results as a passing PostgreSQL or production security gate.

## Academy publication accounting

Unchanged: **889 canonical / 338 published / 184 authored-unpublished / 367 unauthored**. Keep P1–P4 gates and sequential publication order. Vercel `git.deploymentEnabled=false`; GitHub Actions manual-only.

## Next TODO

1. Run `npm ci`, `npm run test:p5-bundle`, `npm run verify:offline`, and `npm run build` on a real Node 24 checkout; preserve exact command logs.
2. Run `npm run qualify:p5:http-db` against a dedicated disposable PostgreSQL 17+ cluster. Fix only observed real SQL failures; do not infer correctness from parser/string checks.
3. Implement an independent, locked, pooled PostgreSQL adapter and robust production-style permission model; test database tenancy under concurrent requests and connection reuse.
4. Build actual provider-backed private upload flow with byte checks, quarantine, signed URL expiry, revocation and independent malware scanning. Revalidate all negative security cases.
5. Perform third-party identity verification, human accessibility checks, and per-lesson editorial acceptance before promotion.
