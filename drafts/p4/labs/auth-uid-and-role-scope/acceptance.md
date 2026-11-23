# 14.03.02 — RLS and authorization qualification (NOT EXECUTED)

**Boundary:** Real Supabase Auth, Data API roles, Storage permissions and PostgreSQL RLS are not reproduced by parsing lesson text.

## Allowed role test
Use the real Supabase Auth local stack and actual client JWTs. Log expected allowed/denied rows while withholding token contents from Git.

## Explicit denied test
Try a second user, no JWT and an anonymous sign-in user. Confirm policy decisions use ownership and verified identity rather than role name alone.

## Security and operational cautions
Supabase Auth anonymous sign-ins can use the authenticated Postgres role; TO authenticated does not necessarily mean a permanent nonanonymous identity. Enforce app-specific eligibility separately.

Test anon and two authenticated synthetic users in a dedicated local Supabase stack with table grants and RLS enabled. Do not use a service-role connection to assert end-user data isolation. Do not modify live projects or copy JWT secrets into Git. Obtain human security review before publication.
