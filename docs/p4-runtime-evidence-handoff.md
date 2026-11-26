# P4 supplemental runtime evidence handoff

This is qualification infrastructure, not publication or topic-level acceptance. Three bounded suites are available: prisma, supabase, and supabase-extended. They reference 26 distinct curriculum topics as relevant context, not as complete lesson coverage. All 64 P4 manual wrappers remain blocked.

## Commands

- npm run qualify:p4:evidence -- --plan prisma
- npm run qualify:p4:evidence -- --plan supabase
- npm run qualify:p4:evidence -- --plan supabase-extended
- npm run qualify:p4:evidence -- --collect SUITE DIRECTORY
- npm run qualify:p4:evidence -- --check SUITE DIRECTORY
- npm run test:p4:runtime-evidence

Use a clean checkout, Node 24.11+, an existing directory outside the checkout and the documented disposable loopback service configuration in examples/p4-runtime/README.md and examples/p5-distributed-runtime/README.md. Prisma requires its own genuine tracked lockfile, which is currently missing. Do not invent one or reuse an unrelated lock. The extended Supabase suite uses the existing tracked distributed-runtime lockfile. Never link a hosted Supabase project or use a service-role key.

The collector requires a successful exit and the exact existing suite completion message. It emits a bounded JSON receipt bound to the checked-out commit, not stdout, connection strings, tokens, signed URLs, passwords or synthetic user IDs. It refuses to overwrite existing receipts and rejects checkout drift. Checking a receipt validates structure and commit binding, not authenticity. The receipt does not replace topic-specific positive/negative artifacts, human review, or release gates.

## Remaining work
- Prisma: genuine lock, generated client, migration qualification on actual PostgreSQL; additional per-topic exercises for seed, migration drift, raw SQL, pool configuration, query tracing and Supabase integration.
- Supabase: actual isolated stack, two test users, positive/negative HTTP and SDK checks; separate OAuth, MFA, SSR, session refresh, Postgres Changes, Presence and webhook exercises.
- PostgreSQL 12.04/12.05: collect the 13 supported artifacts and complete genuine manual performance/operator obligations. Do not add these mixed-evidence modules to the guarded apply allowlist until their complete publication contract is implemented and tested.
- Canonical queue: 09.02 remains next; named P1 review is still mandatory. No production deployments or curriculum publication authorized.

References: https://supabase.com/docs/guides/local-development ; https://supabase.com/docs/guides/storage/security/access-control ; https://supabase.com/docs/guides/realtime/authorization

Validation in this session: seven isolated Node 22 receipt model tests passed; CLI syntax checked. No real P4 runtime suite, full offline matrix or Chromium run has been completed on this change.
