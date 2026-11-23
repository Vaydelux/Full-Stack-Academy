# P5 Identity RLS and data privacy checkpoint — 2026-11-23

## Problem diagnosed

Prior capstone schema forced RLS on `documents` but granted its restricted runtime role SELECT on all rows of the synthetic `users` and `memberships` tables. The HTTP API did not expose raw queries, but **the database role itself was more permissive than the least-privilege teaching model intended**.

## Changes

- Enable RLS for both synthetic identity tables and add actor-scoped SELECT policies addressed to the generated `p5r_*` runtime role. Table owner remains authorized for independent fixture setup/revocation.
- Add an instructor-only `privacy.sql` query run with transaction-local synthetic actor and restricted database role.
- Add a fail-closed `proveIdentityScope` method for Alice, Bob, viewer and suspended fixtures, requiring exact visible-user/membership counts, no other actor rows, no cross-tenant documents and expected own-tenant document visibility.
- Make the live HTTP/PostgreSQL qualifier run this privacy proof before the server begins its acceptance tests.
- Add 12 source and adversarial tests for missing RLS, incorrect metadata visibility, wrong actor/role, invalid fixture identity, and verification order; update the P5 npm test command.
- Expand the instructor README and learner capstone worksheet to distinguish HTTP object-level authorization from database-level identity privacy.

## Verification evidence and limits

- Reconstructed existing P5 files from confirmed committed Git blob sources; the previous selected Node 22.16.0 suite passed **89/89**.
- After the change, ran **101/101 selected Node tests successfully**, including the 12 new tests, against the modified local files. All five new/changed SQL/JavaScript/test Git blob hashes are matched before PR merge.
- This is **not** a complete Node24 checkout, browser acceptance or live PostgreSQL execution. The host has no Docker daemon, PostgreSQL server or `psql` client; no real RLS row visibility result may be claimed.
- Test-only actor GUCs do not authenticate arbitrary SQL clients. Do not deploy the demonstration or relax least-privilege constraints.

## Publication and deployment

Canonical curriculum remains 889 = 338 published + 184 authored-unpublished drafts + 367 unauthored. Existing P1–P4 gates remain pending. Vercel Git deployment remains disabled; GitHub Actions remain manual-only.

## Next task

On a Docker-capable local workstation, run `npm run qualify:p5:container` and capture the evidence runner output and verified Git SHA. Inspect actual PostgreSQL errors, correct the SQL based on real behavior, and separately run full Node24 `npm ci`, Next production build and browser/accessibility acceptance. Preserve publication freeze until validated.
