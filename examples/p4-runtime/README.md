# P4 runtime verticals — isolated, not published

This milestone builds actual integration test source, not a blanket qualification of 64 lessons.

## Prisma 7
Use Node 24.11.1+ (24.x) and a new PostgreSQL 17+ database named academy_test_prisma on numeric loopback. Create a dedicated login owner without elevated cluster privileges or memberships. Never point a tunnel at a live database. Set ACADEMY_PRISMA_ISOLATED=YES and ACADEMY_PRISMA_URL to its local connection string in your shell (never commit secrets).

From examples/p4-runtime/prisma:
- npm install --package-lock-only --ignore-scripts
- Inspect and commit the genuine package-lock.json; npm ci
- npm run qualify

This runs the actual database identity preflight, Prisma validate/generate/migrate deploy/status, then a real generated-client acceptance test. The migration is authored source; generated client, migration execution and lockfile remain unverified until the workstation runs them. The actor parameter in the teaching repository is an already-verified server identity, not a browser-provided identifier. Membership lookup and optimistic writes are scoped; concurrent membership revocation and DB-enforced RLS for Prisma are separate exercises. Do not use this role as a public API credential. Prisma 7 is intentionally retained for curriculum compatibility.

## Supabase
Create a fresh local CLI stack using the installed CLI help and its documented local workflow. Create two distinct confirmed synthetic email/password users at example.test. In the disposable local SQL session only, review and apply supabase/fixture.sql as an explicit test fixture. This is not a migration for any connected project. Do not apply it to a shared/live project; reset/discard the local stack after use.

Set ACADEMY_SUPABASE_ISOLATED=YES, ACADEMY_SUPABASE_URL (e.g. http://127.0.0.1:54321), ACADEMY_SUPABASE_PUBLIC_KEY (publishable or legacy anon only), ACADEMY_SUPABASE_A_EMAIL, ACADEMY_SUPABASE_A_PASSWORD, ACADEMY_SUPABASE_B_EMAIL and ACADEMY_SUPABASE_B_PASSWORD. Use real local credentials only. Run from root: npm run qualify:p4:supabase. The suite uses Node fetch against real Auth, REST and Storage endpoints rather than a mock or a new SDK dependency; it verifies identity on the server, tests positive and negative RLS operations, private object upload/download and signing authorization. Never expose tokens or the signed URL in logs. Actual signed URL redemption/expiry, signed uploads, Realtime, SDK-specific semantics and session refresh are separate work. Some Storage versions use legacy error envelopes; if the test fails, inspect the actual response locally and add a narrowly specified adapter, never accept arbitrary failure.

## Source test
npm run test:p4-runtime-source runs 11 isolated guard/HTTP and repository tests, which use injected fetch/query/transaction responses; these do not connect to services. Runtime tests require actual service access and fail rather than silently skip. No automatic promotion.

References: https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/introduction ; https://www.prisma.io/docs/orm/v7/prisma-schema/overview/generators ; https://supabase.com/docs/guides/api/securing-your-api ; https://supabase.com/docs/reference/self-hosting-auth ; https://supabase.com/docs/guides/storage/security/access-control

## Extended qualification
The separate `examples/p5-distributed-runtime` workspace now contains SDK-based signed upload, signed download expiry and private Broadcast authorization acceptance source. See its README and run `npm run qualify:p4:supabase-extended` only after completing the documented independent local setup. Not live-qualified here.
