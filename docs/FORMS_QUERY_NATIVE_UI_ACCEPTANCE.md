> **LATEST SOURCE-EXECUTION UPDATE (2026-11-20):** The nine native simulated-DOM scenarios described below have now passed **9/9 using actual Node HTTP sockets**, not only the old mock handler transport. Together with 22 HTTP + 29 workflow + 20 typed-client + 12 policy + 10 new browser-navigation tests, **102/102 tests passed** against SHA-matched repository source on Node 22.16. Managed Chromium blocked local navigation; no actual UI browser check passed. See [updated evidence](FORMS_QUERY_REAL_NODE_ACCEPTANCE.md); statements below describing prior simulated-only results remain historical.

# Forms/Query — Native Browser Correctness Milestone

**Development date:** 2026-11-20
**Branch:** `feat/native-task-idempotency-ui-recovery-20261120`
**Previous merged milestone:** PR #32, merge commit `3096d703`

## Verified issue and repair

The browser-native task form previously retained the original idempotency key after an uncertain POST response but **still allowed a new Create submission** to mint a different key. This could duplicate a task when the server had committed the first POST but the response was lost. It also allowed status and delete operations to overlap, creating UI races against stale task revisions. An HTTP 422 was presented as another ambiguous retry, and there was no explicit way to discard an unknown POST result.

### New browser behavior

1. A native form submission uses an operation key bound to its normalized title/priority payload. While a create is pending, other writes and competing reads are disabled.
2. A transport error, 408/429, or 5xx keeps the **same request and key**. The fresh Create control stays disabled; Retry and **Discard uncertain attempt** appear.
3. Retry sends precisely the original payload/key. Replayed 201 is treated as a confirmed create; the key and retry prompt are cleared.
4. Discard explicitly warns that the original request might already have succeeded, and creating again may make a duplicate. Only this user action unlocks a fresh operation.
5. Terminal HTTP 4xx errors other than 408/429 are rejected without offering a misleading uncertain-result retry. The learner can correct the input and create a new operation.
6. Confirmed POST 201 is separated from the later GET; a GET refresh failure **does not** mark the POST unconfirmed or offer another create replay.
7. Create, PATCH status and DELETE share one synchronous mutation lock. The same lock disables existing and newly rendered task controls, prevents user-driven concurrent pagination refresh, and releases via finally after mutation completion.
8. The existing bounded request journal still records only method/outcome metadata, without task titles or idempotency-key secrets. Retry and discard controls are responsive and keyboard-focusable.

## Quality gates added

- `tests/forms-query-native-ui.test.mjs`: **nine** native event-handler integration cases with dependency-free simulated DOM backed by the genuine loopback task server when run using Node. The cases cover confirmed 201, dropped response and same-key replay, blocked fresh POST, explicit discard, terminal 422, confirmed POST plus failed GET, PATCH-vs-DELETE lock, 12-record cursor pagination, 409 stale cursor restart and request-log privacy.
- `scripts/verify-forms-query-browser.mjs`: expanded from nine to **15** real Chromium/Edge/Chrome CDP checks. The six new checks install a pre-document test-only fetch interceptor so the native module captures injected network faults, then verify 409 restart, dropped-POST same-key retry, terminal 422, confirmed-POST/GET failure separation, a held PATCH blocking DELETE, and explicit discard warning.
- Local source command `npm run test:forms-query-native-ui`, root offline verification and `npm run qualify:forms-query:source` now include the nine-case Node test. The optional browser command remains `npm run qualify:forms-query:browser`; full release qualification also requires it.

## What was actually executed

- **9/9** cases passed against the exact current GitHub task API, task client, native browser event-handler and test source in an **isolated simulated-DOM/mock request-and-response harness**. This validates the real event-handling logic and API routing decisions, but **does not establish a Node HTTP socket or Chromium browser pass**.
- Syntax parsing passed for the current native browser module, new test file (after module import syntax normalization), and expanded browser test script.
- The injected new-document Chromium fault script parsed as JavaScript, and all documented `#retry`/`#discard` markup IDs exist.
- The earlier PR #32 typed-client tests had 20/20 isolated mocked-request scenarios, 12/12 policy cases and 11/11 source-wiring cases. They are historical supporting evidence, not a new end-to-end run on this exact branch.
- **Not run here:** `node --test` on actual checkout, a real browser session for the 15 CDP checks, root Next/npm install/build, nested React typecheck/browser/SSR, existing 337 published labs or all 16 staged real-library lesson tests.
- npm/GitHub DNS resolution in the local execution environment prevented obtaining an exact source checkout and installing npm packages. GitHub repository edits were performed directly via the connected source service.
- No GitHub Actions or Vercel checks invoked.

## Recommended exact local qualification

```bash
# Node 22 or newer; runs true loopback HTTP sockets and simulated DOM
npm run test:forms-query-native-ui
npm run qualify:forms-query:source

# Chrome / Chromium / Edge installed; no browser dependency package
npm run qualify:forms-query:browser

# Node 24, trusted real npm-generated root + nested lockfiles and packages
npm run qualify:forms-query:full
```

A real browser run must additionally inspect keyboard focus, readable 320px controls, 200% zoom, color contrast, retry/discard messages and 15-paged-task behavior. Fix any actual failed result before announcing the lesson project as qualified.

## Curriculum status is unchanged

The full academy has **28 tracks, 111 modules, 889 canonical topics, 338 published unique lesson IDs, 337 authored MDX and published lab manifests, 42 completed modules, 551 remaining unpublished topics**. The 16 React Hook Form 09.02 / TanStack Query 09.03 topic packs remain staged and unqualified; this UI correction is a prerequisite for publishing, not a publication event.

**Next:** Execute the latest true network and browser gates on a real checkout, resolve npm package locks, qualify real RHF/Query types/DOM and the 16 red/green lesson packages, then atomically publish one fully verified module at a time.
