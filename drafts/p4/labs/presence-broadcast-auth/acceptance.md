# 14.04.06 — Storage/Realtime acceptance plan, NOT EXECUTED

## Positive full-stack test
Two alpha users see each other's presence and receive a non-sensitive update, then disconnect cleanly.

## Required negative security test
A beta user attempts to join alpha's channel and broadcast a forged task-change event. The join/send should be rejected under the relevant policies.

## Security and reliability boundary
Presence is ephemeral and not a durable user-status or access-control database. Private Realtime policy joins require real authenticated tests and may have connection-rate costs.

Run against a disposable local Supabase stack with a private bucket, explicit Storage policies, a Realtime authorization policy, and two real synthetic Auth identities. Never validate end-user RLS with a service-role client. For uploads, independently inspect content bytes on the server; for realtime, record denied cross-tenant joins and teardown behavior. Capture only sanitized evidence.
