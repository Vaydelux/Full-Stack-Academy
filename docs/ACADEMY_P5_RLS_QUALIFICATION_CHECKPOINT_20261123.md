# P5 Security Qualification Expansion — November 23, 2026

## Delivered source

- Added a disposable **database-role RLS** lab with three NOLOGIN/NOBYPASSRLS principals, tenant-scoped document and membership policies, 14 numbered assertions and a transaction rollback.
- Added a fail-closed, double-confirmation local PostgreSQL runner and 10 Node guard/source regression cases.
- Added a canonical 32-topic P5 curriculum auditor with nine mutation tests: catalog/title/ID parity, draft-only status, guided steps, checks, references and detection of premature publication.
- Added npm commands and a dedicated instructor README. No production schema, dependencies, lesson registry, learner progress, deployment configuration, or GitHub Actions changes.

## Real validation and limitations

Local Node **22.16.0** tests: RLS runner guards 10/10 passed, curriculum auditor mutation tests 9/9 passed, and previously authored policy unit tests 11/11 passed in their mounted local fixture. GitHub source inspection covered all 32 P5 manuscript titles and draft statuses with no mismatches. These are strictly **source and small-fixture tests**. Full checkout Node 24, Next build, browser/a11y, authenticated app-to-RLS integration and actual PostgreSQL RLS execution remain pending.

The existing HTTP teaching server has not yet been attached to a real PostgreSQL/identity provider. A standalone RLS test, even if later run successfully, must not be presented as production tenant-isolation certification.

## Accurate curriculum accounting

- Canonical 889.
- Published 338, unchanged.
- Source-authored unpublished 184.
- Not yet authored 367.

## Next substantial milestone

1. Run the entire repository on a real Node 24 checkout: `npm ci`, `npm run test:p5-bundle`, `npm run verify:offline`, `npm run build`; capture exact output.
2. Execute `npm run qualify:p5:postgresql` and `npm run qualify:p5:rls` on a dedicated disposable PostgreSQL 17+ instance and record whether the SQL policies actually pass.
3. Build a genuine authenticated HTTP + database adapter using a maintained PostgreSQL client with a real lockfile; verify cross-tenant isolation, membership revocation and write races in that integration.
4. Add authenticated upload bytes, scanning, expiry and private storage tests; then human accessibility/evidence and sequential P1→P5 promotion.

Maintain the Vercel Git deployment freeze and manual-only workflows. **Do not publish P5 on source checks.**
