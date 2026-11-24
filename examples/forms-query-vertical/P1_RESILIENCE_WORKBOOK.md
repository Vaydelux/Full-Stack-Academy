# P1 real boundary practice — Forms and Query

This companion uses the existing real Node loopback server and React candidate packs. It is not a replacement for the 16 canonical draft lessons or their installed React/browser tests. Use synthetic tasks only; this API is unauthenticated, single-instance memory, and not a deployable service.

## Start and verify

From the repository root with Node 22+ (release qualification requires stable Node 24.9+ in the 24.x line):

```bash
npm run test:forms-query-resilience
```

No installed RHF or Query dependencies are needed for these 25 tests; the TypeScript retry policy is executed using Node's strip-types support. The HTTP tests bind ephemeral loopback ports and close their server connections. For hands-on HTTP exploration, run `node examples/forms-query-vertical/task-api.mjs` and use the same-origin local practice page or a local HTTP client. A fresh fixture has no tasks.

## The contract you are practicing

| Operation/outcome | Meaning | Learner action |
|---|---|---|
| POST 201 + Idempotency-Replayed false | First accepted create | Keep its key, observe original Location |
| POST 201 + replay true | Historical accepted receipt, not current resource state | Reconcile through GET/list; never recreate automatically |
| POST 409 | Changed payload under old key or a capacity denial | Read error, stop blind retry, resolve the conflict |
| POST/PATCH 400 | Invalid JSON or malformed UTF-8 | Correct encoding/serialization |
| POST/PATCH 413/415 | Byte limit or unsupported media/encoding | Reduce or correct request, do not repeat blindly |
| POST/PATCH 422 | Field or state validation failed | Show accessible field/form feedback |
| PATCH 412/428 | Stale or missing revision | Refresh state and reconcile intentional edit |
| GET list 409 | Old list cursor after state-changing write | Reset pagination to page one |
| Read AbortError | Intentional cancellation | Do not retry canceled read |
| Create response lost/aborted | Commit may have occurred | Retain same immutable payload and operation ID |

The ledger accepts at most 200 distinct successful creates by default, even if tasks are later deleted. Existing keys replay at capacity; new keys return 409. Rejections do not consume slots. The historical response does not change after a task update and replay cannot resurrect a deleted task. Start a fresh **disposable** fixture when it is exhausted. Restart loses all state: this is a bounded learning tradeoff, not a production idempotency design. A production service requires a durable, scoped ledger and explicit retention/reconciliation policy.

## React Hook Form — 09.02

| Topic | Independent exercise | Required observable result |
|---|---|---|
| 09.02.01 Controlled/uncontrolled | Use the existing starter and instructor title form; enter a valid Unicode title, then a short title. Inspect request and form output separately. | Editable registered field; short value rejected without a write. Real keyboard and React test still required. |
| 09.02.02 Register/Controller | Register native title and select; wrap a controlled priority picker. Reset the form and inspect JSON. | One owner per field; displayed priority matches submitted value, reset restores defaults. |
| 09.02.03 Zod resolver | Compare whitespace-only and valid trimmed title in RHF, then send malformed UTF-8 directly to the API. | Client rejects invalid fields; server independently rejects malformed bytes (400), invalid fields (422). |
| 09.02.04 Dynamic field arrays | Add three local checklist items, remove the middle item, then submit only the existing allowed task fields. | Stable identity preserves neighboring values; checklist extras are not leaked into the task API. |
| 09.02.05 Async submission | Run the parallel same-key create and replay-after-delete tests. In the browser, simulate a lost response and retry the same key. | One entity per logical create; original receipt survives; deleted row remains absent. |
| 09.02.06 Reset/dirty | Edit an existing form while background data refreshes; distinguish dirty local changes from a confirmed create. | Unconfirmed refresh does not erase edits; reset occurs only under deliberate policy. |
| 09.02.07 Server errors/focus | Map 422 to a useful form error and exercise 409 capacity as a form-level error. | Error is announced and focus is recoverable; rejected write does not consume a receipt. |
| 09.02.08 Form-state bug hunt | Force duplicate submit and malformed input; inspect pending/dirty/error state and repeat after correction. | No duplicate create; failure does not show success or erase input. |

## TanStack Query — 09.03

| Topic | Independent exercise | Required observable result |
|---|---|---|
| 09.03.01 Query keys | Query all/todo/doing/done lists; include filter in resource identity. | Distinct filtered datasets never overwrite each other. |
| 09.03.02 Stale/garbage policy | Observe the current candidate's stale and garbage collection controls with fake time or a real installed Query client. | Fresh cache and evicted inactive cache are distinct; do not infer from HTTP timing alone. |
| 09.03.03 Mutation invalidation | Create a task and compare first page before/after the successful write. | List revision changes and stale cursor returns 409; rejected write/replay preserves revision. |
| 09.03.04 Optimistic rollback | Trigger competing revision updates; simulate one rejected optimistic UI change. | One HTTP writer succeeds, one gets 412; UI reconciles authoritative state without losing unrelated changes. |
| 09.03.05 Infinite queries | Get first page with limit one; create another task; request the old cursor. Compare with an unsafe numeric cursor. | Stale cursor returns 409; malformed numeric cursor returns 400; restart from page one. |
| 09.03.06 Retries/cancellation | Run cancellation suite. Cancel an active installed Query read, then inject a transient transport error and compare. | Intentional AbortError is not retried; transient error has one retry; ambiguous POST retains key. |
| 09.03.07 SSR/hydration | Use the existing SSR candidate and isolated Next harness; compare first rendered data, hydration and request count. | No mismatch or duplicate initial fetch beyond declared policy; actual browser execution required. |
| 09.03.08 Remote task capstone | Combine create, filtered listing, competing update, deletion and same-key replay. | No resurrection or duplicate effect; UI shows current authoritative data and meaningful recovery. |

## Red/green and independent evidence

The 20 real HTTP cases and five cancellation-policy cases in this milestone are executable regression examples. In a disposable copy of the repository, compare original commit `1017cba69d3778ba20387f770789c35f4381d97c` to the repaired sources, using the new test files on both. Do not overwrite the working checkout. Original failure counts: 10 HTTP and two cancellation tests; repaired counts: 20 HTTP and five cancellation tests passing on Node22.16.0.

For each exercise record candidate SHA, runtime, fixture, predicted result, actual result, pass/fail/not-run, and missing acceptance evidence. A local HTTP test does not prove component behavior, mounted Query state, SSR hydration, keyboard accessibility, or screen reader behavior. Those require the existing browser candidates and human review. Do not publish either eight-lesson module until its full reviewed gate passes.
