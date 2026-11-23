# 14.04.07 — Storage/Realtime acceptance plan, NOT EXECUTED

## Positive full-stack test
A signed synthetic event creates exactly one processing record, with authorized tenant context and sanitized logs.

## Required negative security test
Try an unsigned payload, altered raw bytes, a replayed event ID and a forged tenant. All must be rejected or deduplicated without a second side effect.

## Security and reliability boundary
The HMAC header/format shown is a teaching contract, not a claim that Supabase Database Webhooks automatically sign this way. Configure an authenticated webhook path or gateway explicitly and verify actual provider support.

Run against a disposable local Supabase stack with a private bucket, explicit Storage policies, a Realtime authorization policy, and two real synthetic Auth identities. Never validate end-user RLS with a service-role client. For uploads, independently inspect content bytes on the server; for realtime, record denied cross-tenant joins and teardown behavior. Capture only sanitized evidence.
