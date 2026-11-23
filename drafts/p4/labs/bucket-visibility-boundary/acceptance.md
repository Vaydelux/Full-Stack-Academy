# 14.04.01 — Storage/Realtime acceptance plan, NOT EXECUTED

## Positive full-stack test
Authenticated alpha may download the same private object using permitted access; bucket config remains private.

## Required negative security test
Upload an alpha document; request its regular public URL with no token and attempt to read it as beta. Both must fail.

## Security and reliability boundary
A private flag alone does not prevent overbroad authenticated Storage policies. Public URLs, CDN/browser cache and signed URLs require their own revocation and expiry review.

Run against a disposable local Supabase stack with a private bucket, explicit Storage policies, a Realtime authorization policy, and two real synthetic Auth identities. Never validate end-user RLS with a service-role client. For uploads, independently inspect content bytes on the server; for realtime, record denied cross-tenant joins and teardown behavior. Capture only sanitized evidence.
