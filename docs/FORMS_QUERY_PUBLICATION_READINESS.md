> **2026-11-20 candidate handoff:** This document's earlier baseline is historical. PR #38 now combines 16 deeper source lessons and draft preview routes with automated source checks, but new Next/Playwright/human accessibility qualifications remain unexecuted for the candidate. The official published snapshot is still 338 IDs. Consult `docs/P1_CONTENT_PREVIEW_ACCEPTANCE.md` before attempting module promotion.

# Forms/Query 09.02 + 09.03 — Publication Readiness & Release Plan

**Checked against main:** `ec518b41cdb08003580a865a213311d1660dfd9f` (2026-11-20).  
**Feature branch:** `feat/forms-query-publication-preflight-release-hygiene-20261120`.  
**Current count:** 338 published unique lessons; 337 authored MDX/lab manifests; 16 staged Forms/Query lesson packs; 551 unpublished canonical topics.

## Review of the new commit

The merge `ec518b41` added a **genuine npm-generated nested React lockfile**, source fixes for staged lessons, an isolated Vite qualification mount, React browser testing, Next SSR hydration verification, and fixes in existing academy labs. The updated checkpoint **reports** local Node 24.22.3 `verify:offline`, 130 Forms/Query Node cases, all 16 positive instructor and intentionally failing starter tests, 15 native Chromium UI checks, seven React workspace flows, and an isolated Next SSR hydration check.

This report trusts the committed development notes as **reported prior local evidence**, not a new full execution by this assistant. The user runtime here is Node 22.16.0 without GitHub/npm DNS and cannot reproduce the Node 24 full build or the user's Windows Chromium session.

The same merge accidentally committed three files under the Vite client's `dist/` folder even though that directory was already ignored. This feature removes those three generated artifacts from Git history going forward **without removing the real lockfile**. A new offline regression test prevents them from becoming tracked again.

## New deterministic readiness audit

```bash
# Reports topics and blockers; read-only, no network or hosted CI.
npm run status:forms-query-promotion

# Checks all 16 staged MDX/metadata/fixture parity and Git release hygiene.
npm run test:forms-query-promotion

# Deliberately fails until both modules are genuinely published and
# the manual accessibility evidence is recorded.
node scripts/forms-query-promotion-readiness.mjs --strict
```

`scripts/forms-query-promotion-readiness.mjs` checks **each canonical 09.02 and 09.03 topic** for title, module, official reference, prerequisites, red/starter code fence parity, genuine browser-verification entry and publication-atomicity. Its source errors fail `--check`. Its `--strict` mode additionally requires real published assets, registries, locked nested exercise dependencies, published stack-version pins and **human accessibility evidence**. This tool cannot manufacture browser or assistive-technology qualifications.

### Required manual accessibility evidence (not yet completed)

Create a reviewer-authored JSON file separately for each module, only **after** an actual screen-reader and keyboard/200% zoom review:

`docs/release-evidence/forms-query-09.02-accessibility.json` or `docs/release-evidence/forms-query-09.03-accessibility.json`.

Example shape (illustrative only; **do not commit this with `reviewed: true` without executing the checks**):

```json
{
  "moduleId": "09.02",
  "reviewed": false,
  "reviewer": "Reviewer identifier",
  "date": "2026-11-20",
  "keyboard": false,
  "zoom200": false,
  "screenReader": "Name and version of tested assistive technology",
  "lessonIds": ["09.02.01", "09.02.02", "09.02.03", "09.02.04", "09.02.05", "09.02.06", "09.02.07", "09.02.08"]
}
```

The reviewer should test actual keyboard-only forms, expected focus after submission and error, correct labels/announcements, query loading/empty/error states, 200% text zoom at phone and desktop widths, consistent heading/landmark order and reduced-motion behavior. A Chrome DOM check does **not** substitute for testing a screen reader.

## Publication integration: one full eight-topic module at a time

1. **Keep the runtime isolated:** React Hook Form 7, `@hookform/resolvers` 7 and TanStack Query 5 already have a genuine integrity-locked manifest in `examples/forms-query-vertical/react-client/`. The Next academy renders fenced MDX source only and does **not** need these packages added to its root dependencies. Major keys `reactHookForm: "7"` and `tanstackQuery: "5"` are already pinned in `content/stack-versions.json`. Run both real `npm ci` commands in a Node24 checkout before promotion.
2. **Produce canonical MDX and metadata**, respecting the strict `scripts/validate-content.mjs` schemas. The staged `sourceStatus` metadata is not the same as the published `status:'authored'` format. Replace draft-only directions in MDX with real published lab commands; add `<LabGate interactive={false} />` to avoid misleading links to unimplemented in-browser exercises.
3. **Publish 8 executable lab folders**, with stable `lab.react.forms-query-*` IDs, substantive tests that really execute the library, red starters with explicit expected assertion failures, and `npm run lab:forms-query-*` scripts. Never count a copied TSX file as a verified runnable lab. The root `test:labs` runner must discover the new manifests correctly.
4. **Update both static registries atomically**: `src/content/lesson-registry.tsx` must import/render each MDX page; `src/lib/academy/published.ts` must import/index the metadata. Check `generateStaticParams()` and role/unknown-route behavior. Preserve all existing IDs.
5. **Reconcile staged-curriculum checks.** Existing `scripts/verify-forms-query-drafts.mjs` intentionally rejects staged IDs that appear as published; when a full module is promoted, either move its staging fixtures to a stable qualification location or explicitly teach the checker that those sources are now published without disabling the starter/browser tests. Avoid duplicate live/staged sources silently diverging.
6. **Run acceptance on the exact publication candidate:** Node 24 `npm ci`, nested `npm ci`, `npm run qualify:forms-query:full`, the complete `npm run verify:offline` suite, published lab negative gates, `npm run checkpoint:write && npm run checkpoint:check`, real Next build and production browser smoke.
7. **Only after manual review and green gates**, update `docs/checkpoint.json`: publishing one eight-topic module should raise 338 to 346 unique published lessons, 337 to 345 MDX/labs and 42 to 43 completed modules. The second module should raise them to **354 published, 353 MDX/labs and 44 completed modules**. These are targets, **not current totals**.

## Current blockers reported by the audit

- Canonical publication assets, root dependencies and root stack-version entries are absent, by design.
- Human screen-reader/200% zoom and keyboard assessment is not documented.
- A complete Node 24/Next production build on the exact *publication candidate* has not been run in this environment.
- The previously qualified 16 staged teaching exercises are not yet packaged as 16 published, individually discoverable lab manifests.

**Decision:** Keep the 16 packs staged and do not inflate the published totals until both the manual and automated release gates pass. Prioritize finishing these two modules before spending further effort on unverified NestJS/PostgreSQL lesson generation.

No GitHub Actions or Vercel checks were used or requested.
