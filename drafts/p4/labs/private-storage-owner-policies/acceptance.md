# 14.03.05 — RLS and authorization qualification (NOT EXECUTED)

**Boundary:** Real Supabase Auth, Data API roles, Storage permissions and PostgreSQL RLS are not reproduced by parsing lesson text.

## Allowed role test
On a dedicated Supabase local stack, create a private demo bucket, test SELECT/INSERT/UPDATE and signed URL behavior under two JWTs. Verify URL TTL and object paths.

## Explicit denied test
Upload under alpha's user folder, request a signed URL as beta and verify denial. Check that signed URLs eventually expire and cannot be logged publicly.

## Security and operational cautions
A signed URL is a bearer capability for its lifetime; do not publish it. Storage upsert can require INSERT + SELECT + UPDATE. Server/service bypass keys must never appear in the browser.

Test anon and two authenticated synthetic users in a dedicated local Supabase stack with table grants and RLS enabled. Do not use a service-role connection to assert end-user data isolation. Do not modify live projects or copy JWT secrets into Git. Obtain human security review before publication.
