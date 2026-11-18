# JavaScript + TypeScript Full-Track Offline Acceptance

**Date:** 2026-11-19 · **Branch:** `feat/js-ts-two-track-offline` · **Release:** intentionally paused.

## Exact canonical module scope

| Module | Eight-lesson outcome | Evidence |
|---|---|---|
| 03.01 | scope, coercion, equality, branching, closures, collections, spread, data transformer | Red/green Node ESM tests |
| 03.02 | generators, keyed collections, prototypes, binding, modules, errors, immutability, shared-store bug | Instance and error-boundary tests |
| 03.03 | event loop, microtasks, async/await, combinators, abort, retries, races, resilient fetch | Injected Promise/AbortSignal tests, no HTTP |
| 03.04 | DOM, delegation, forms, URL state, storage, performance, text injection, accessible tabs | Local HTML + Node + Chromium |
| 04.01 | strict config, inference, unions, interfaces, nullish, guards, overloads, task model | Strict tsc and runtime tests |
| 04.02 | generics, keyof, mapped and conditional types, discriminants, utility types, template strings, unsafe casts | Strict compile-negative @ts-expect-error plus Node |
| 04.03 | runtime type erasure, Zod parsing, errors, branded IDs, date boundaries, DTOs, type tests, API schema | Runtime Zod schemas, declared contracts |
| 04.04 | module resolution, ESM/CJS, import hygiene, exports maps, project references, ESLint, declarations, typed package | Local manifest examples and actual tsc declaration tests |

## Gates

1. Reproducible starter failure and passing instructor module for every lesson; no fake remote endpoints.
2. All MDX, metadata, two HTTPS references, three steps, quiz, misconceptions, bug hunt and lab contracts checked.
3. CI locked install, lint, strict TypeScript, repository tests, all local labs, content checkpoint, production build in **GitHub** only.
4. Browser tests confirm 03.04 DOM behaviors and old 02/CSS + reader/Practice regressions.
5. Runtime safety of browser content includes textContent rather than unsafe innerHTML for user text; browser storage tests gracefully handle unavailable origin-scoped databases.
6. Qualify actual screen reader/keyboard coverage and hosted deployment separately; do **not** certify WCAG from a local demo.

### Nonclaims

- No Vercel deployment and no production release.
- No server-saved grades, arbitrary hosted learner code runner, real live HTTP or persisted cross-device storage.
- TypeScript annotations are erased; Zod boundaries here are local and do not implement authorization.
- Package examples are not published to npm; declaration tests demonstrate local emitter output only.
