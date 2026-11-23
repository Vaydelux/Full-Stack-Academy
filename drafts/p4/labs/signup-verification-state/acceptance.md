# 14.02.01 — Supabase Auth integration qualification (not run)

## Positive test case
Use Supabase local Mailpit to inspect confirmation email and test pending, confirmed, wrong-password and expired-link paths. Compare browser and server session state.

## Forbidden or error case
Create a new local test user with email confirmation enabled; verify they cannot access the protected dashboard without a session. Try a wrong password without revealing account existence.

## Session/authentication boundary
Never treat a non-null user in a signUp response as permission to read private data. Rate-limit login endpoints and avoid detailed account-enumeration errors.

Use disposable Supabase local Auth identities and, for SSR examples, a full Next.js dev server with the framework's token refresh Proxy. Do not log tokens, recovery secrets or production account information. This source-only exercise is not accepted as a passed runtime/security gate.
