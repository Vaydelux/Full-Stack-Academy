# 14.01.04 — separate, not-yet-executed integration verification

## Positive integration test
Inspect migration history and local replay in Docker-backed Supabase. Record target project, applied SQL hashes and rollback/forward-fix strategy.

## Negative unauthorized or unsafe case
Start a fresh local stack from only migrations and seed files; verify the schema is recreated. Ensure no production deployment command runs as part of this draft.

## Privilege and environment boundary
supabase db reset deletes local data not recreated by migrations/seed. Never run it on a valuable database. Mixing Prisma and Supabase migration writers can cause drift.

Use a dedicated Supabase local stack and two synthetic users. Do not execute the examples on live projects, use production keys, or claim source audit results establish RLS protection. Confirm current CLI versions and run independent data API tests.
