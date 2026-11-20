# Forms/Query — Verified Local Node Qualification (2026-11-20)

**Source branch:** `feat/forms-query-real-node-92-browser-diagnostics-20261120`  
**Base:** merged PR #33 (`b8b466d7e380b02eaf60e12eabea30eb17f89172`)  
**Scope:** dependency-free Forms/Query Node API, native DOM harness, policy rules, and browser-navigation diagnosis. This does **not** certify the React Hook Form or TanStack Query application, a Next production build, or a live browser UI.

## Directly executed local Node evidence

A temporary, minimal checkout was reconstructed from exact connected GitHub file contents because local shell DNS could not resolve github.com or registry.npmjs.org. The test and source files were SHA-verified against GitHub's published Git blob hashes before execution. The repo's real Node HTTP listener was used; this was **not** the earlier mocked HTTP transport.

**Toolchain:** Node.js v22.16.0 on Linux, native `node:test`, real loopback `127.0.0.1` ephemeral HTTP sockets; native TypeScript stripping for the standalone API/policy module. All independent suites passed together.

| Suite | Direct pass | What it proves |
|---|---:|---|
| `tests/forms-query-http.test.mjs` | **22/22** | Real local HTTP, normalized POST, idempotency replay, capacity, CSP/static delivery, bad input and CORS rejection |
| `tests/forms-query-workflow.test.mjs` | **29/29** | Actual wire-level Host spoof rejection via `node:http`, hostile targets, 412 concurrent edits, PATCH preconditions, cursor isolation and invalidation |
| `tests/forms-query-react-api.test.mjs` | **20/20** | Real HTTP through the exact TypeScript client boundary, lost-response replay, paginated reads, 409/412 and cancellation; does **not** mount React |
| `tests/forms-query-native-ui.test.mjs` | **9/9** | Native event handlers in a simulated DOM connected to the real loopback Node HTTP server; retry/discard, terminal error, concurrency guard and pagination |
| `tests/forms-query-policy.test.mjs` | **12/12** | Typed retry, state machine, query key isolation and bounded retry decisions |
| `tests/forms-query-browser-navigation.test.mjs` | **10/10** | Policy denial, navigation failure, expected loopback-form identification, malformed CDP values, and non-disclosure of page body |

**Combined: 102 tests, 102 pass, 0 fail, 0 skipped, 0 cancelled**. No GitHub Actions, Vercel, cloud CI or npm packages were used.

The five pre-existing GitHub test files (22+29+20+9+12), plus the API, client, native HTML/CSS/JS and policy source, matched their source Git blob SHAs. The new 10-case navigation suite was first executed locally and then added through the GitHub connector; its committed source SHA matched the locally tested file.

## Browser gate: infrastructure blocked, not passed

Chromium 144 launched and Chrome DevTools Protocol (CDP) connected successfully. Node's own fetch returned HTTP **200** for both the API health endpoint and the served HTML. However, navigating Chromium to that **same** ephemeral `http://127.0.0.1:<port>/` produced:

- URL `chrome-error://chromewebdata/`;
- browser message indicating that **organization policy blocks viewing 127.0.0.1**.

No bypass of the managed browser policy was attempted. **Zero native Chrome UI assertions were qualified** in this environment. The source browser gate retains its existing 15 interaction, keyboard and mobile checks for a machine where local HTTP navigation is permitted.

This milestone fixes browser-gate diagnostics to classify a managed-policy block or other top-level Chrome/Edge failure **before** timing out looking for `#task-form`. The result is a clear actionable error, not a false UI failure or a fabricated pass. It verifies server-side HTML availability independently before navigating.

## Reproduce in an authorized full checkout

```bash
# Real HTTP and native event/policy tests, Node 22+:
npm run qualify:forms-query:source

# Browser policy classifier only, Node 22+:
npm run test:forms-query-browser-navigation

# Native HTML app in real Chromium/Chrome/Edge on a machine permitting loopback:
npm run qualify:forms-query:browser

# Node 24, actual npm-generated root and nested React package locks:
npm run qualify:forms-query:full
```

`--source` additionally runs staging, contract, project and React-wiring scripts that were **not all executed** in this partial checkout. The 102 verified tests are the exact six suites in the table, not an assertion that the complete `--source` or `--full` gate succeeded.

## Still outstanding / publication blockers

1. Full Node 24 checkout: root `npm ci`, lint, TypeScript, Next build, all 337 published labs and negative-starter tests, content/checkpoint integrity checks.
2. Browser-permitted machine: run the 15 real Chromium CDP native-UI checks, responsive/keyboard, 200% zoom and screen reader verification.
3. Real npm-resolution of RHF, `@hookform/resolvers` and TanStack Query, trusted generated nested package lock, nested React `npm ci`, typecheck, build and real mounted React DOM tests.
4. 16 staged React Hook Form / TanStack Query lesson packs: individual positive and intentional failing red-starter tests, supported SSR hydration, accessibility and whole-module promotion.

The verified canonical snapshot remains **28 tracks, 111 modules, 889 topics, 338 unique published lesson IDs, 337 MDX and lab manifests, 42 complete modules and 551 unpublished topics**. The 16 staged Forms/Query topics remain **unpublished**. The demo task API is intentionally unauthenticated, in-memory and loopback-only; never deploy it as a public service.

**Next engineer:** Do not undo these real test results or rerun the same mocked harness as though it were stronger proof. Use an approved browser on a full checkout, then resolve real React package/install/test gates and promote 09.02/09.03 only once actually qualified.
