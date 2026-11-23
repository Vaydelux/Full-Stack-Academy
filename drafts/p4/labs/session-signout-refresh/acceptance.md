# 14.02.07 — Supabase Auth integration qualification (not run)

## Positive test case
Test sign-out scopes, token refresh, multi-device behavior and session revocation timing using two local test clients.

## Forbidden or error case
Sign out in one browser and try refreshing the private page or using another session; verify the intended global/local session behavior. Note that previously issued JWTs may last until expiry.

## Session/authentication boundary
Global sign-out revokes refresh tokens but may not make every already-issued JWT immediately fail RLS checks. Use session freshness validation for high-risk actions.

Use disposable Supabase local Auth identities and, for SSR examples, a full Next.js dev server with the framework's token refresh Proxy. Do not log tokens, recovery secrets or production account information. This source-only exercise is not accepted as a passed runtime/security gate.
