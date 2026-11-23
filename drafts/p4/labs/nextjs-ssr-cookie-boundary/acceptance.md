# 14.02.02 — Supabase Auth integration qualification (not run)

## Positive test case
Use a local Next.js build plus Supabase Auth test user; test refresh, logout, reload and server-rendered unauthorized redirects. Verify cookie writes reach the response from a writable context.

## Forbidden or error case
Tamper with a browser cookie to claim isAdmin, or use an expired access token; server access must remain denied or refresh according to configured session rules.

## Session/authentication boundary
Do not rely on getSession's user object as independent server authorization. Cookie adapters and token refresh behavior vary with framework version and must be verified against the installed @supabase/ssr.

Use disposable Supabase local Auth identities and, for SSR examples, a full Next.js dev server with the framework's token refresh Proxy. Do not log tokens, recovery secrets or production account information. This source-only exercise is not accepted as a passed runtime/security gate.
