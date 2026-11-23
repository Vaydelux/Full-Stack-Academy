# 14.02.03 — Supabase Auth integration qualification (not run)

## Positive test case
In a local test identity provider flow, verify approved redirects, PKCE flow tracking, callback expiration and a single authenticated server session.

## Forbidden or error case
Inject an external redirectTo parameter and verify it is never passed to signInWithOAuth. Test an invalid or replayed callback code and expect failure.

## Session/authentication boundary
A correct redirect URL does not replace checking state, verifier association and identity/session freshness. Never place authorization codes or tokens in logs.

Use disposable Supabase local Auth identities and, for SSR examples, a full Next.js dev server with the framework's token refresh Proxy. Do not log tokens, recovery secrets or production account information. This source-only exercise is not accepted as a passed runtime/security gate.
