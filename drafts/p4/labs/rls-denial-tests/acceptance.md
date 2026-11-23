# 14.03.03 — RLS and authorization qualification (NOT EXECUTED)

**Boundary:** Real Supabase Auth, Data API roles, Storage permissions and PostgreSQL RLS are not reproduced by parsing lesson text.

## Allowed role test
Run Supabase's documented pgTAP RLS tests with anon, two authenticated users and server-side roles. Do not assume set_config alone reproduces every Auth session claim or token refresh behavior.

## Explicit denied test
Deliberately replace the owner-only policy with USING (true) in a disposable instance and verify the test fails, then restore the correct policy.

## Security and operational cautions
Tests using a privileged SQL role can bypass RLS and produce misleading results. Use role impersonation and actual JWT-backed requests, and avoid modifying real auth.users records.

Test anon and two authenticated synthetic users in a dedicated local Supabase stack with table grants and RLS enabled. Do not use a service-role connection to assert end-user data isolation. Do not modify live projects or copy JWT secrets into Git. Obtain human security review before publication.
