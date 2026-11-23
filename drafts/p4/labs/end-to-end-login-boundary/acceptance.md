# 14.02.08 — Supabase Auth integration qualification (not run)

## Positive test case
Implement a local Next.js SSR + Supabase login route and use two isolated users. Verify sign-up/confirmation, login, protected data, cross-tenant denial, logout and refresh.

## Forbidden or error case
Edit user_metadata.isAdmin as a normal user, request another tenant and replay an expired session; all must fail. Confirm only authorized membership produces a valid response.

## Session/authentication boundary
The membership lookup requires its own RLS policy and Grants. This sample does not automatically secure update/delete endpoints or privileged Prisma access.

Use disposable Supabase local Auth identities and, for SSR examples, a full Next.js dev server with the framework's token refresh Proxy. Do not log tokens, recovery secrets or production account information. This source-only exercise is not accepted as a passed runtime/security gate.
