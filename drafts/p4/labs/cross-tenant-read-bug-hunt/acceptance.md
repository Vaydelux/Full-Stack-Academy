# 14.03.08 — RLS and authorization qualification (NOT EXECUTED)

**Boundary:** Real Supabase Auth, Data API roles, Storage permissions and PostgreSQL RLS are not reproduced by parsing lesson text.

## Allowed role test
In a dedicated local Supabase project, create alpha/beta rows; run policies under both JWTs and anon, verify positive/negative SELECT, INSERT and UPDATE with appropriate USING/WITH CHECK rules.

## Explicit denied test
Attack with a known beta task ID using alpha's JWT. Confirm that beta rows remain invisible, including nested relation loads and any caching layer.

## Security and operational cautions
This SELECT example does not automatically secure writes. INSERT needs WITH CHECK; UPDATE requires SELECT visibility and BOTH USING and WITH CHECK. A server-side privileged connection needs its own explicit authorization.

Test anon and two authenticated synthetic users in a dedicated local Supabase stack with table grants and RLS enabled. Do not use a service-role connection to assert end-user data isolation. Do not modify live projects or copy JWT secrets into Git. Obtain human security review before publication.
