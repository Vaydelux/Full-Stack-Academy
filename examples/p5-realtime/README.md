# Track 17 Teaching Labs — Realtime, Notifications & Collaboration

These are **dependency-free, unpublished instructor demonstrations** supporting exactly 24 canonical Track 17 lessons. The modules use synthetic tenants, actors, deterministic clocks, and loopback Node HTTP. No Supabase Realtime, push/email provider, or Yjs database is connected.

## Run the local exercises

From the repository root, with Node.js 22+:

```bash
npm run test:p5-realtime-labs
npm run test:p5-realtime-source
```

The first command runs **43 actual Node tests**, including a live Server-Sent Events (SSE) connection over `fetch()`. The second audits all 24 canonical draft manuscripts, plus **12 negative/mutation tests** for the publication gate. The Academy's production release policy additionally requires Node 24, a full Next.js build, browser accessibility evidence, and real provider integration.

## Lab 1 — Authenticated live activity feed

`feed.mjs`, `sse.mjs` and `feed.test.mjs` implement an ephemeral tenant-scoped event hub and a **real localhost HTTP transport**. The lab demonstrates:

- HMAC-signed, short-lived **synthetic test sessions**, tenant-scoped authorization on subscribe and publish, and rejection of other-tenant channel access.
- SSE `text/event-stream` framing with numeric ordered IDs, `Last-Event-ID` replay and `409 snapshot_required` when the finite history is too old.
- Bounded retained history and concurrent subscribers, defensive event copies, live authorizations on publication, protected POST origin and test-session logout that closes active streams.
- Failure cases for invalid IDs, unauthorized read/write, expired/tampered tokens, subscription limits, cross-origin requests and history gaps.

**Browser limitation:** Native `EventSource` does not accept arbitrary Bearer authorization headers. This teaching transport intentionally uses `fetch()` streaming rather than claiming a ready-to-use browser `EventSource` integration. A production app needs an established session-cookie or token protocol, trusted cross-site policy, heartbeat/backpressure, reconnect behavior and durable replay state.

**Durability limitation:** history and revoked tokens live only inside a single Node process; process restart loses them. Authorization changes can close a subscription on the next broadcast, not necessarily immediately for an idle stream. Never deploy the synthetic auth as production identity.

## Lab 2 — Recipient-owned notification center

`notifications.mjs` and `notifications.test.mjs` simulate tenant/user access control, deduplication scoped to recipient, bounded in-app history, read/unread state, preferences, fixed UTC quiet-hour intervals and pagination.

The instructor must demonstrate an authorized user reading their own notifications and another user receiving an authorization error. Demonstrate that disabling in-app delivery does not imply an email was delivered. The deduplication fingerprint window is deliberately **bounded**; old event IDs may eventually be accepted again. A real implementation requires persistent unique keys, consent logs, timezone/DST rules, provider acknowledgments and reliable durable retry states.

## Lab 3 — Versioned collaborative notes

`collaboration.mjs` and `collaboration.test.mjs` simulate:

- A tenant/document permission check on read, create, save and presence.
- Compare-and-swap (CAS) document versions to reject overwriting newer text.
- Operation-ID replay detection, a process-local best-effort deduplication map, short-lived presence and an offline queue that **stops at the first conflict or network failure instead of silently overwriting the server**.
- Defensive copies of document snapshots and explicit conflict-state UX.

**This is not Yjs or a CRDT.** A real Yjs integration requires separate tests of concurrent character-level changes, provider synchronization, document persistence, awareness cleanup and offline convergence. The demo's in-memory idempotency and presence may not survive process restart.

## Instructor acceptance checklist

1. Show a successful and a denied cross-tenant SSE subscription using the actual loopback HTTP tests.
2. Replay from a valid cursor and force a history-gap response requiring snapshot resynchronization.
3. Show recipient isolation, preference handling, duplicate notifications and unread state.
4. Show one successful CAS save, a rejected stale edit, and an offline draft retained after conflict.
5. Record exact Node version, Git SHA, test results, and explicit gaps against Supabase Realtime/Yjs/email/push.
6. Keep all lessons `draft-unverified` and `readyToPublish: false` until Node24, integration, editorial review and browser accessibility qualify.

## Authoritative references

- [HTML Standard — Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [MDN — Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [Supabase — Realtime authorization](https://supabase.com/docs/guides/realtime/authorization)
- [Supabase — Presence](https://supabase.com/docs/guides/realtime/presence)
- [Yjs — Shared types](https://docs.yjs.dev/getting-started/working-with-shared-types)
- [Yjs — Awareness](https://docs.yjs.dev/getting-started/adding-awareness)

## Operational runtime follow-on
See `examples/p6-runtime/README.md` for real local process/HTTP/SSE/SQLite and telemetry tests, measured loopback load, and opt-in WebSocket/Docker qualification source. Existing teaching models remain separate; no lesson is published by these tests.
