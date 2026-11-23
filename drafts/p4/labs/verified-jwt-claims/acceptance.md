# 14.02.06 — Supabase Auth integration qualification (not run)

## Positive test case
Using local Auth test users and rotated/expired tokens, verify getClaims, getUser and role lookup behavior. Record access-token expiry semantics; don't overstate immediate revocation of JWTs.

## Forbidden or error case
Provide an altered JWT payload with isAdmin true and a stale/revoked session; the privileged route must reject the forgery and apply its revocation freshness requirements.

## Session/authentication boundary
An unexpired JWT can remain signature-valid after a session is revoked. Select getUser/session checks for operations needing fresher session revocation guarantees.

Use disposable Supabase local Auth identities and, for SSR examples, a full Next.js dev server with the framework's token refresh Proxy. Do not log tokens, recovery secrets or production account information. This source-only exercise is not accepted as a passed runtime/security gate.
