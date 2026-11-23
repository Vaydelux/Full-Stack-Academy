# P5 qualification evidence checkpoint — November 23, 2026

## Milestone

Added an executable Node 24/PostgreSQL 17 evidence runner and report verifier to the isolated P5 Compose capstone. The runner records an exact clean Git commit, required runtime versions, four ordered command exit statuses, success-marker checks, per-command log digests, and a completion timestamp. It prints a single base64url evidence record without credentials or raw logs.

The verifier rejects missing/duplicated records, incorrect commit, stale/future timestamps, incorrect Node/PostgreSQL versions, failed/incomplete stages, absent SQL markers and invalid digest formats. Dockerfile now includes Git to identify the mounted source commit, and the Compose command invokes the evidence runner rather than four unrecorded shell commands.

## Actual evidence

- Node **22.16.0** local run against the reconstructed real P5 source directory: **78/78** targeted source/HTTP/container/evidence tests passed (60 earlier tests plus 18 new runner/verifier tests).
- The existing 9 Compose structure tests were adjusted to check that the four commands are declared by the evidence runner, not inline in Compose.
- Seven new/modified code and configuration files were checked against their exact local Git blob hashes before committing.
- **NOT RUN:** Docker Compose, Node24 container, live PostgreSQL17/psql, full Next build, browser/a11y or provider-backed authentication. Database qualification remains **blocked**, not passing.

## Curriculum and deployment

889 canonical topics: **338 published, 184 authored-but-unpublished drafts, 367 unauthored**. The changes are isolated from the reader, lesson registry, learner progress, npm dependencies/lockfiles, Vercel automatic deployments and workflow triggers.

## Next actions

1. On a Docker-capable workstation, execute `npm run qualify:p5:container` and capture its full output as shown in `examples/p5-security/container/README.md`.
2. Run `verify-evidence.mjs` against the captured log and the exact checked-out Git SHA; preserve the original log securely for review.
3. Fix any genuinely observed PostgreSQL SQL/RLS or Node24 failures before any claim of P5 publication readiness.
4. Independently qualify the full Next.js install/build, browser/accessibility, upstream identity provider and real private file scanning.
