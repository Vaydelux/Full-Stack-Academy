# 14.04.03 — Storage/Realtime acceptance plan, NOT EXECUTED

## Positive full-stack test
An approved 1MB PDF is stored at the verified user's private key and independently confirmed by the server.

## Required negative security test
Rename an executable to .pdf, send fake MIME and an over-limit payload. No unscanned file may be published or served as trusted content.

## Security and reliability boundary
The snippet's browser-side checks cannot identify malicious bytes. Configure bucket allowed MIME/size, enforce quotas and add server-side malware scanning when risk justifies it.

Run against a disposable local Supabase stack with a private bucket, explicit Storage policies, a Realtime authorization policy, and two real synthetic Auth identities. Never validate end-user RLS with a service-role client. For uploads, independently inspect content bytes on the server; for realtime, record denied cross-tenant joins and teardown behavior. Capture only sanitized evidence.
