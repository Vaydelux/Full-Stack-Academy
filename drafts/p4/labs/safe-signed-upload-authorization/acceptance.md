# 14.04.02 — Storage/Realtime acceptance plan, NOT EXECUTED

## Positive full-stack test
Alpha receives a token for alpha's deterministic path and uses uploadToSignedUrl on a disposable private bucket.

## Required negative security test
As alpha, request a token for a beta folder, reused document key or unauthorized MIME type; no cross-owner token should be issued.

## Security and reliability boundary
Upload tokens are bearer secrets valid for a limited window; they must not be logged, embedded in analytics, or mistaken for a permanent ACL. Backend must still validate content independently.

Run against a disposable local Supabase stack with a private bucket, explicit Storage policies, a Realtime authorization policy, and two real synthetic Auth identities. Never validate end-user RLS with a service-role client. For uploads, independently inspect content bytes on the server; for realtime, record denied cross-tenant joins and teardown behavior. Capture only sanitized evidence.
