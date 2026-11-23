# 14.03.01 — RLS and authorization qualification (NOT EXECUTED)

**Boundary:** Real Supabase Auth, Data API roles, Storage permissions and PostgreSQL RLS are not reproduced by parsing lesson text.

## Allowed role test
Apply to an isolated local Supabase stack, seed two users and run authenticated API and pgTAP allow/deny tests. Check GRANT privileges separately from RLS.

## Explicit denied test
With alpha's authenticated token, request beta's task ID. The Data API must return no row; anon must also not retrieve private records.

## Security and operational cautions
Policy tests must use the actual caller role; a service-role key bypasses RLS and cannot demonstrate that an ordinary JWT is protected. Table owners may bypass unless configured otherwise.

Test anon and two authenticated synthetic users in a dedicated local Supabase stack with table grants and RLS enabled. Do not use a service-role connection to assert end-user data isolation. Do not modify live projects or copy JWT secrets into Git. Obtain human security review before publication.
