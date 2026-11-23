# Track 17 — Realtime, Notifications & Collaboration

**Source-only, unpublished: 24 of 24 canonical manuscripts authored (8 per module).**

| Module | Subjects | Runnable teaching suite |
| --- | --- | --- |
| 17.01 Realtime Models | polling/SSE/WebSockets, event order, replay, private channels, presence, backoff, duplicates | `feed.test.mjs` and real loopback SSE |
| 17.02 Notifications | schema, preferences, email/push models, templates, fan-out, quiet hours, delivery records | `notifications.test.mjs` |
| 17.03 Collaboration Patterns | optimistic edits, CAS, ephemeral presence, Yjs concepts, permissions, offline conflicts | `collaboration.test.mjs` |

All manuscripts in `drafts/realtime/lessons/` use their canonical catalog ID/title/module and remain marked `draft-unverified` / `readyToPublish: false`. Each contains contextual scenario design, a reproduced unsafe pattern, guided correction and acceptance target, misconception, instructor rubric, knowledge checks and primary documentation.

The examples are intentionally **process-local teaching fixtures**, not production Supabase Realtime, Yjs, email/push, a database, or durable offline storage. Only the SSE HTTP transport uses a real localhost Node server.

From the repository root:

```bash
npm run test:p5-realtime-labs
npm run test:p5-realtime-source
```

Before publication: complete full Node24/Next verification, a browser/mobile accessibility review, and independently qualified Supabase private channels, event durability, Yjs convergence and provider delivery semantics. Maintain the existing P1–P5 gate sequence and never add drafts to the published registry prematurely.
