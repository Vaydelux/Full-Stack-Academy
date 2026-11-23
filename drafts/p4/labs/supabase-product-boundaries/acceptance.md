# 14.01.01 — separate, not-yet-executed integration verification

## Positive integration test
Use local Supabase with two test identities. Verify Auth sign-in, RLS-protected PostgreSQL data, private Storage policy, and an authorized Realtime channel separately.

## Negative unauthorized or unsafe case
Search browser bundles for secret/service_role values. Authenticate as alpha and attempt beta's data and private storage paths, expecting denial.

## Privilege and environment boundary
A publishable key is not a permission grant. RLS, Grants and Storage policies must deny unauthorized users. Service roles can bypass RLS.

Use a dedicated Supabase local stack and two synthetic users. Do not execute the examples on live projects, use production keys, or claim source audit results establish RLS protection. Confirm current CLI versions and run independent data API tests.
