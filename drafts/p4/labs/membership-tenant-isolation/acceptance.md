# 14.03.07 — RLS and authorization qualification (NOT EXECUTED)

**Boundary:** Real Supabase Auth, Data API roles, Storage permissions and PostgreSQL RLS are not reproduced by parsing lesson text.

## Allowed role test
Test with two local JWT accounts, including role-specific GRANT checks. Verify membership read policy denies unrelated rows and task policy respects the membership change.

## Explicit denied test
Seed alpha and beta tasks plus a user with membership only in alpha. Ask for beta tasks; expect no results. Remove their alpha membership and confirm access disappears.

## Security and operational cautions
Membership table RLS and query indexes are part of the security/performance boundary. An application-side tenant parameter must never override the membership policy.

Test anon and two authenticated synthetic users in a dedicated local Supabase stack with table grants and RLS enabled. Do not use a service-role connection to assert end-user data isolation. Do not modify live projects or copy JWT secrets into Git. Obtain human security review before publication.
