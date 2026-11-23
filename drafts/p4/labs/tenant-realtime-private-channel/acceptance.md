# 14.04.04 — Storage/Realtime acceptance plan, NOT EXECUTED

## Positive full-stack test
Alpha can subscribe to its own approved topic, receive a non-sensitive test event, and remain isolated from beta.

## Required negative security test
Subscribe as alpha to beta's private topic with a valid JWT and expect CHANNEL_ERROR or denial without any beta payload.

## Security and reliability boundary
Realtime policies are evaluated for channel joining and refreshed under certain events; membership changes may require reconnect/re-authorization. Broadcast payloads should not contain long-lived secrets.

Run against a disposable local Supabase stack with a private bucket, explicit Storage policies, a Realtime authorization policy, and two real synthetic Auth identities. Never validate end-user RLS with a service-role client. For uploads, independently inspect content bytes on the server; for realtime, record denied cross-tenant joins and teardown behavior. Capture only sanitized evidence.
