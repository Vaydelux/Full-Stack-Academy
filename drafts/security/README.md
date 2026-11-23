# P5 Security curriculum: source drafts, not publication

32 canonical P5 topics are now authored in `drafts/security/lessons/`: 15.01 Applied Security Foundations (8), 15.02 Identity & Permissions (8), 15.03 Application Security (8), 15.04 Security Operations (8).

A dependency-free educational example is in `examples/p5-security/`; run its Node unit tests locally. This does **not** qualify security posture of the production app. Required: source and content review, starter/solution pairing, real auth + database cross-tenant cases, current standards review, Node24 offline/build, browser/a11y and named reviewer approval.

**Accounting:** 338 published + 184 source-authored unpublished + 367 unauthored = 889. Keep the live registry and Vercel deploy freeze unchanged. Publication remains P1→P2→P3→P4→P5.

## Current qualification assets (unpublished)

- `examples/p5-security/http-lab`: ephemeral Node HTTP instructor exercise with in-memory state.
- `examples/p5-security/postgres-lab`: 14 disposable SQL predicate assertions, not RLS.
- `examples/p5-security/rls-lab`: 14 database-role RLS assertions, requires a dedicated disposable PostgreSQL cluster.
- `examples/p5-security/source`: canonical source audit, 32 draft-only modules.

Use `npm run test:p5-bundle` for the offline source/fixture gates; see the RLS lab README for the explicitly opted-in real database checks. Publication remains frozen pending independent runtime, security and accessibility qualification.
