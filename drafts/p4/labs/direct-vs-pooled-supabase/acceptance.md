# 14.01.06 — separate, not-yet-executed integration verification

## Positive integration test
Record endpoint topology, pool mode, TLS behavior and maximum concurrent connections. Verify with actual Prisma 7 adapter and the selected Supabase pooler version.

## Negative unauthorized or unsafe case
Test migration commands with the direct URL on a disposable instance; separately test runtime under a pooler and confirm session-dependent features work or are deliberately avoided.

## Privilege and environment boundary
Connection strings contain secrets. Never expose them to browser bundles or logs. Transaction pooling may invalidate session-affine assumptions.

Use a dedicated Supabase local stack and two synthetic users. Do not execute the examples on live projects, use production keys, or claim source audit results establish RLS protection. Confirm current CLI versions and run independent data API tests.
