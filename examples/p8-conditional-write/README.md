# Conditional writes: two clients, one revision

Companion exercise for 09.03.08 and 09.03.07. No dependencies or credentials required. From the repository root:

```sh
node --test examples/p8-conditional-write/*.test.mjs
```

Read the instructor fixture and the tests. Predict the result of two concurrent PATCH requests with the same ETag. Run the tests and compare your prediction.

## Guided repair

1. In a disposable copy, remove the If-Match comparison in server.mjs (leave the missing-header check intact).
2. Run the tests: the stale-writer and concurrent-writer checks should fail. Record the two responses and current revision.
3. Restore the comparison after body reading and before mutation. Run the tests again.
4. Explain why an HTTP 412 must trigger a fresh GET and reconciliation, not blind retry of the stale revision.
5. Explain why a 428 (missing precondition) and 422 (invalid body) must leave state unchanged.

Acceptance: one winner for a shared revision; stale writes rejected; updated revision returned; bad requests do not mutate. Record actual red and green results.

Scope: this is a loopback, in-memory teaching server with one task and a deliberately narrow exact-single-ETag contract, not a general HTTP conditional request implementation. It provides no identity, authorization, persistence, durable idempotency or distributed concurrency guarantees. Production systems need atomic database conditional writes and authorization. It is a companion HTTP exercise, not evidence that the actual React Query browser lab passes.

## Request-boundary exercise

The server rejects non-loopback listener/Host combinations (421), cross-origin requests (403), unsupported media types/encodings (415), malformed UTF-8 (400), oversized bodies (413) and unfinished request bodies (408). Only JSON with an optional UTF-8 charset is supported. The 1024-byte ceiling is enforced before buffering declared oversized requests and while reading chunked bodies. A five-second absolute body deadline is used by default; the tests use a short override. Rejected requests must preserve the task revision. Compare an incomplete chunked upload against a normal complete upload using the supplied boundary tests. These are local learning safeguards, not public-service security or a full HTTP conditional request implementation. Always bind explicitly to loopback.
