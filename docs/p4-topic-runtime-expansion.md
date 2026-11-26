# P4 topic runtime expansion

Candidate source, not runtime qualification or publication approval.

## Prisma

The existing generated-client test runner now requires two passing tests (zero skipped, failed, cancelled or todo). The additional test checks five deterministic IDs per synthetic tenant, repeatable createMany seed with skipDuplicates, scoped findMany/findUnique, bounded keyset traversal, tagged-template raw SQL literal binding including an injection-shaped synthetic input, and competing version-guarded updates from two distinct Prisma clients. Exactly one writer wins; the other tenant remains unchanged. Exact UUID-scoped cleanup is mandatory.

Related topics: 13.01.07, 13.02.01, 13.02.05, 13.03.01 and existing transaction/tenant topics. This does not prove relation loading, all isolation levels, or a production migration/seed strategy. Prisma still requires a genuine workspace lockfile and disposable local database.

## Supabase

Recreate the disposable local fixture (do not run against production). The private test bucket now allows text/plain only, max 1024 bytes. The existing HTTP suite adds invalid-token rejection, foreign-folder upload rejection, MIME and size rejection, foreign delete denial or empty result with owner-read positive control, owner delete and absence checks. The error adapter distinguishes narrow Storage response reasons from generic failure. Actual response envelopes must be verified on the installed local stack; don't widen acceptance to arbitrary 400 or 500. No privileged API keys. The fixture is teaching-only, not a hosted migration.

## Verification

Four isolated response adapter tests passed with Node 22. Actual Prisma and Supabase runs, complete offline matrix and Chromium are still pending. The receipt remains supplemental; related topic metadata is expanded, not a claim of completed lesson qualification. No human approvals or publication state changed.

References:
- https://www.prisma.io/docs/orm/v7/prisma-client/using-raw-sql/raw-queries
- https://www.prisma.io/docs/orm/v7/prisma-client/queries/pagination
- https://supabase.com/docs/guides/storage/security/access-control
- https://supabase.com/docs/guides/storage/buckets/fundamentals

## Repository-level follow-up

The seed, keyset page and exact-title raw SQL exercises now execute through the verified-actor membership transaction instead of only using trusted direct Prisma Client calls. Reader seed attempts and nonmember cross-tenant page/raw access are denied before task access. The existing two-client optimistic contention exercise is preserved. Seven injected-client source tests passed on Node 22, including input bounds and parameter binding. Actual service execution is still pending; the wrappers do not demonstrate concurrent membership revocation or database-enforced RLS.
