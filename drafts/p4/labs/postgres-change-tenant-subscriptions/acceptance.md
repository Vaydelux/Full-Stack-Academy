# 14.04.05 — Storage/Realtime acceptance plan, NOT EXECUTED

## Positive full-stack test
Alpha receives an authorized task-change notification and reloads only safe projected task data.

## Required negative security test
As alpha subscribe to beta's known tenant ID; no beta private row contents should arrive. Reconnect after a membership revocation and confirm access changes.

## Security and reliability boundary
Filters are not security policies. Realtime publication and RLS visibility differ for DELETE events and replica identity. Check actual event semantics and scaling before production.

Run against a disposable local Supabase stack with a private bucket, explicit Storage policies, a Realtime authorization policy, and two real synthetic Auth identities. Never validate end-user RLS with a service-role client. For uploads, independently inspect content bytes on the server; for realtime, record denied cross-tenant joins and teardown behavior. Capture only sanitized evidence.
