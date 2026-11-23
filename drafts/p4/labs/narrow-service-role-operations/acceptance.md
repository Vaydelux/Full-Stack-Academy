# 14.03.06 — RLS and authorization qualification (NOT EXECUTED)

**Boundary:** Real Supabase Auth, Data API roles, Storage permissions and PostgreSQL RLS are not reproduced by parsing lesson text.

## Allowed role test
Use a disposable project to test service role access with two tenants, a legitimate moderator and a nonmoderator. Inspect secrets in browser builds and verify audit logging.

## Explicit denied test
Try a malicious caller-supplied canModerate flag and an ID from another tenant. The server must derive permissions independently and keep the forbidden record unchanged.

## Security and operational cautions
A caller-controlled actor object cannot be trusted even if typed in TypeScript. Enforce privilege checks with fresh trusted data; short-lived JWTs and session revocation matter for sensitive operations.

Test anon and two authenticated synthetic users in a dedicated local Supabase stack with table grants and RLS enabled. Do not use a service-role connection to assert end-user data isolation. Do not modify live projects or copy JWT secrets into Git. Obtain human security review before publication.
