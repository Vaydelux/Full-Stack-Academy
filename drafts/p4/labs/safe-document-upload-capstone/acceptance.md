# 14.04.08 — Storage/Realtime acceptance plan, NOT EXECUTED

## Positive full-stack test
A permitted alpha PDF moves from PENDING to READY only after server-side byte verification and remains unreadable by beta.

## Required negative security test
Try forged tenant IDs, beta paths, oversized disguised content, duplicate document IDs and failed scans. All must deny exposure and avoid orphaned READY metadata.

## Security and reliability boundary
Storage and PostgreSQL are not one atomic transaction. Plan idempotency, token expiry, orphan cleanup, retries and safe failure states. Never report a signed upload token as proof the file was scanned.

Run against a disposable local Supabase stack with a private bucket, explicit Storage policies, a Realtime authorization policy, and two real synthetic Auth identities. Never validate end-user RLS with a service-role client. For uploads, independently inspect content bytes on the server; for realtime, record denied cross-tenant joins and teardown behavior. Capture only sanitized evidence.
