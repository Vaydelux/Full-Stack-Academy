# Full-Stack Academy — Offline Continuation Handoff

**Checkpoint date:** November 19, 2026. **Active development branch:** `feat/06-07-react-next-curriculum`. **Source baseline:** main `7e8f42d` (merged CSS, JS/TS and Git tracks). **Release hold:** Do not run or check GitHub Actions or Vercel, do not deploy; do not merge this unverified feature branch.

## Work completed in this larger-scope milestone

1. **React 19** — authored `06.01.02–06.05.08` (39 new MDX lessons plus existing `06.01.01`), including typed pure contracts, instructor and intentionally broken starter code, actual TSX component examples, and React DOM Server initial-markup assertions.
2. **Next.js 16** — authored `07.01.01–07.05.08` (40 lessons): App Router, async params, Server/Client boundaries, mutations, explicit Cache Components, SEO and operations. These contain offline policy/architecture tests and **illustrative** Next route samples, not running standalone Next servers.
3. **Academy wiring** — 79 lesson registrations, metadata entries, lab commands, new syntax gate, starter red regression, mobile/sitemap/browser smoke coverage, canonical Beginner/Intermediate levels and version sources.
4. **Hardening** — changed an insecure authentication-cookie sample to deny by default, made publishing wait for trusted persistence before cache invalidation, added meaningful Effect cleanup and prevented keyboard shortcuts from hijacking buttons/form controls.
5. **Reference system** — added 16 detailed React/Next API reference drafts to four existing drafts. Upgraded the reference directory with keyboard-accessible search/category/detailed filters, a count and reset. Added a local reference schema test, pure filtering tests and browser search smoke.
6. **Long-term execution** — machine-readable `docs/delivery-waves.json`, `scripts/plan-curriculum-waves.mjs` and `docs/MEGA_SCOPE_DELIVERY_PLAN.md` define seven whole-track waves covering all remaining 630 unique topic IDs.

## Truthful scope and counts

| Indicator | On active source branch | Verified public deployment |
|---|---:|---:|
| Unique authored lesson IDs | 259 | 61 |
| MDX lesson bodies | 257 | 58 |
| Local lab fixtures | 257 | 58 |
| Complete modules | 32 | 7 |
| Authored detailed reference drafts | 20 | 4 (older release) |
| Indexed reference topics | 303 | 303 |
| Canonical curriculum topics | 889 | 889 |
| Unauthored lesson IDs | 630 | 828 |

**Why 259 and not 260:** existing interactive lesson `07.02.01` is also one of the new MDX bodies. The unique published ID union must deduplicate it. Two other existing interactive IDs in future waves, `09.01.02` and `15.02.04`, account for the difference between 632 future catalog topics and 630 still-unauthored topics.

## Quality gates (source code authored, NOT fully executed)

| Local command | Intent | Current evidence |
|---|---|---|
| `npm run check:react-next:structure` | Canonical IDs, prerequisites, pedagogy, manifests, lab scripts, checkpoint | GitHub repository-tree presence and in-memory source checks performed; script execution pending |
| `npm run check:react-next:syntax` | MDX parser and TS/TSX syntax across the batch | Written; execution pending `npm ci` |
| `npm run test:react-next:snippets` | Static fail-closed/security sample contracts | Equivalent source conditions inspected directly; test-runner execution pending |
| `npm run test:react-next:offline` | Instructor tests for all 79 new lessons | Written, not executed |
| `npm run test:react-next:red` | Intentionally broken starter rejection | Written, not executed |
| `npm run reference:check` | 16 reference entries, official URLs, snippets and cross-links | Source metadata audited directly; TypeScript syntax parser pending |
| `npm run test:reference-search` | Search/category/detailed filtering | Written, not executed |
| `npm run plan:waves:check` | Deterministic reconciliation of 630 remaining topics into seven waves | Generator and manifest cross-checked in memory; command execution pending |
| `npm run lint && npm run typecheck && npm run build` | Framework/TypeScript production qualification | Not executed; do not claim green |
| Local Chromium `scripts/browser-smoke.mjs` | Actual routes, navigation, sitemap, accessibility and responsive search | Scenarios written, not executed |

## Current blockers and known risks

- No local project clone with locked dependencies is available in this editing environment. Runtime and compiler tests are intentionally unverified, rather than inferred from AI-authored code.
- React SSR initial-render tests do **not** exercise hydrated handlers, Effects, transitions, focus or keyboard shortcuts. Next labs' standalone examples are not active App Router files.
- Next.js 16 cache examples require a separate Cache Components-enabled demo, authenticated request isolation and version-specific integration tests. No real persistence or authentication backend is present in educational snippets.
- Existing dev-only Picomatch findings under exception until **December 2, 2026** require an explicit security review before a future release.
- The merge-related Vercel build hooks had previously been canceled. Never assume new source commits update the currently hosted site.
- The new reference details are **drafts**, not editorially verified. Confirm search and authoring in the local Next build before indexing them publicly.

## Next steps for another AI agent

Start with the `npm run verify:react-next:cheap` local gate and fix all real failures without bypassing tests. Then run `npm run verify:react-next:full`, the reference search tests, Chromium and security review. Keep results in the checkpoint. After qualification, begin **W01: tracks 08, 09 and 10** as a single 96-topic scope (95 remain unauthored) with whole-module capstones and the same red/green test standard. The final seven waves cover all remaining 630 topics and culminate in an enterprise full-stack capstone; do not mark future waves as authored before their actual files exist.

This handoff is durable even if a different AI takes over. It contains explicit module IDs, commands, evidence levels and blockers. Do not repeat already completed authoring work; continue from the active branch and its current Git commit.
