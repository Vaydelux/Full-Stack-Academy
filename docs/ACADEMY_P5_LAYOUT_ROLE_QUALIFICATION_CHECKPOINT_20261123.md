# P5 release gate: repository-layout repair and least-privilege runtime role
**Date:** 2026-11-23

## Reproduced defect and repair

The earlier container-source suite had a hidden layout mismatch: `run-container.test.mjs` attempted to read `../cleanup.sql` and `../qualify.mjs` from `examples/p5-security/container/`. In the actual repository, both files live under `examples/p5-security/http-db/`. Reproducing the actual tree yielded **8 passed / 1 failed** (`ENOENT`). Paths were repaired to `../http-db/...`. The container source suite then passed **9/9**.

## Larger security implementation

- Added an independently generated `p5r_<16 hex>` database runtime role per fixture, separate from the `p5h_<16 hex>` owned schema. Runtime role uses `NOLOGIN NOSUPERUSER NOBYPASSRLS`.
- Added narrow SQL `GRANT`s and explicit `REVOKE`s for the schema, identity lookups, and document actions. No user/membership writes or schema creation are granted to the runtime role.
- Each request's SQL transaction now sets the synthetic authenticated test actor and **SET LOCAL ROLE** to the restricted runtime role before touching RLS-protected documents.
- Added `privileges.sql` and mandatory positive/negative privilege checks before starting the genuine HTTP/PostgreSQL acceptance.
- Idempotent schema and generated-role cleanup; independent fixture-admin revocation preserved.
- Added 12 Node regression checks for SQL source, role binding, privilege-probe enforcement, isolation from shell arguments, and learner documentation.
- No npm dependency, lockfile, deployment, workflow or public lesson registry change.

## Actual evidence

- Reproduced original container-layout bug on the true path structure: **8/9** container-source tests passed before fix.
- Executed all existing 39 HTTP/source/hardening tests, corrected nine container-source tests, and twelve new role/source checks: **60/60 tests passed** on **Node 22.16.0** using the exact working source files.
- Eight JavaScript files passed `node --check`. New GitHub blobs were checked against the locally tested file hashes before merge.
- The opt-in Docker command correctly returned a blocked exit code because Docker is unavailable in this runtime.
- **Not executed:** PostgreSQL 17 SQL, Node 24 container, full `npm ci`/Next build, genuine external identity provider, real upload-byte and private storage tests, browser or human accessibility checks. Static/mock tests do not confer production security qualification.

## Release state and handoff

**338 published + 184 source-authored unpublished + 367 unauthored = 889 canonical topics.** Existing P1–P4 gates remain open and publication order must remain sequential. Vercel Git deployment remains disabled, GitHub Actions manual-only.

Next action: run `npm run qualify:p5:container` on a Docker-capable workstation and capture actual SQL/Node24 evidence. Fix genuine PostgreSQL failures before adding a pooled production-style client or promoting lessons.
