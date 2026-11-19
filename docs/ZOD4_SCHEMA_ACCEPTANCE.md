# Zod 4 Schema Design — real validation and local practice

**Date:** 2026-11-19 · **Branch:** `feat/zod4-schema-design-and-live-lab` · **Stacked base:** draft PR #21 at `56da751` (itself on draft PR #20).

## What exists in GitHub source

Eight canonical authored MDX lessons `09.01.01–09.01.08` and matching strict metadata, local lab manifests, deliberately failing learners, corrected instructors and test files. Unlike previous purely modeled lessons, each instructor unit exercises real installed Zod 4 `parse` or `safeParse` behavior, except the deliberately broken learner starter that asserts false success.

The browser-only route `/learn/zod-profile-lab` uses the exact same `ProfileSchema` module (`src/lib/academy/zod-profile.ts`) as the instructor capstone. It validates name/email/age/contact/consent, provides field-level error messages, and shows transformed output. It makes no network request, stores nothing persistently and creates no account.

All 19 existing indexed **Zod** reference API items now have written drafts (18 new plus the existing safeParse draft). The library total is 38 authored drafts / 303 indexed subjects. API reference entries are **drafts**, not proof of example execution.

## Version-aware Zod 4 rules

- `z.object()` strips unknown keys by default; `z.strictObject()` rejects unexpected keys.
- `safeParse` returns a success/error union; error path data resides in `error.issues`, while `z.flattenError` and `z.treeifyError` replace deprecated instance methods.
- `.optional()` allows undefined, `.nullable()` allows null and Zod 4 `.default()` returns an output default for undefined without running transforms; `.prefault()` runs the parse path.
- `z.coerce.number()` supports numeric form text and has an unknown input type; validate integer/bounds. `z.coerce.boolean()` on the string `"false"` yields **true** under JavaScript truthiness.
- `z.discriminatedUnion` uses a literal discriminator. `z.infer` is inferred output; use `z.input`/`z.output` where transformations diverge.
- `.superRefine` remains functional but deprecated in favor of lower-level `.check` in Zod 4. This course demonstrates path-specific issues and documents the modern alternative without inventing its API.
- Parsing a client form improves user feedback but does **not** authenticate a caller or authorize object access.

Official primary documentation: https://zod.dev/api, https://zod.dev/basics, https://zod.dev/error-formatting and https://zod.dev/v4/changelog.

## Proposed stacked source checkpoint

889 canonical lesson IDs, **298 distinct published IDs, 297 MDX lesson bodies, 297 lab manifests, 37 complete modules**; **38 authored reference drafts**. `09.01.02` already existed as interactive-only before this branch, so eight new MDX files increase unique published IDs by seven. First planned/unindexed lesson: `09.02.01`.

## Unexecuted acceptance

```bash
npm ci
npm run verify:offline
npm run test:red-zod-foundations
```

Run local Next + isolated Chromium browser smoke, including `scripts/zod-foundations-smoke.mjs`. Then manually inspect accessible errors, focus, 320px layout, email normalization, numeric conversion and no unexpected network requests. These commands have **not** run: direct GitHub clone from this container fails DNS resolution and connector-only GitHub file writes cannot install project dependencies.

Keep this PR draft until the quality gate is run successfully or the owner explicitly accepts the remaining risk. Merge order is PR #20 → #21 → current Zod branch. No Vercel or GitHub Actions checks.
