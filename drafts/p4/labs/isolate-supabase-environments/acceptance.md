# 14.01.02 — separate, not-yet-executed integration verification

## Positive integration test
Inspect the active project reference, database host and test credentials before local migrations. Verify no published environment variables point at the live project.

## Negative unauthorized or unsafe case
Run the local test harness without SUPABASE_TEST_URL and with a missing approval flag; both should stop before any network request.

## Privilege and environment boundary
An approval flag is a guardrail, not a cryptographic guarantee of environment identity. Compare project IDs and role privileges before destructive operations.

Use a dedicated Supabase local stack and two synthetic users. Do not execute the examples on live projects, use production keys, or claim source audit results establish RLS protection. Confirm current CLI versions and run independent data API tests.
