# 14.02.04 — Supabase Auth integration qualification (not run)

## Positive test case
Test correct/incorrect TOTP flows on a disposable local user, record the returned AAL and verify recovery and factor removal paths.

## Forbidden or error case
Enter an incorrect code, reuse a stale challenge, or close enrollment early; none should produce an authenticated aal2 gate success.

## Session/authentication boundary
Do not log factor secrets, recovery codes or TOTP values. Implement recovery and anti-lockout policies that fit the product's risk model.

Use disposable Supabase local Auth identities and, for SSR examples, a full Next.js dev server with the framework's token refresh Proxy. Do not log tokens, recovery secrets or production account information. This source-only exercise is not accepted as a passed runtime/security gate.
