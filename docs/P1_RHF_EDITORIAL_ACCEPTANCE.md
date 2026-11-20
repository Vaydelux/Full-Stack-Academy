# P1A — Eight React Hook Form teaching drafts expanded

**Date:** 2026-11-20. **Scope:** 09.02.01–09.02.08.

Eight independently authored, production-focused decision guides now cover ownership, controlled widgets, Zod transforms, field identity, idempotency, dirty/reset, HTTP error focus and derived previews. Each includes observable failure comparisons and an independent learner exercise. Existing code fences preserve the exact staged red starter and instructor solution contract.

This phase is **editorial preparation**, not publication. The live registry and canonical counts remain **338/889**, with 16 staged Forms/Query lessons. The new `npm run test:forms-query-rhf-editorial` is a deterministic source audit and joins `verify:offline`; it is not a browser or screen-reader test.

Before publishing 09.02, run Node24 + locked dependencies, `npm run test:forms-query-drafts`, `npm run test:forms-query-rhf-editorial`, `npm run test:forms-query-promotion`, `npm run qualify:forms-query:full`, complete Next production compilation, browser red/green acceptance, keyboard-only and named screen-reader/200% zoom review. Then publish **all eight** with real lab manifests, dependency lock and both static registries in one qualified unit; only then increase published count to 346.

PR #36 independently stages a draft-reading UI and is unmerged. Its MDX changes need conflict resolution if both PRs are combined. No GitHub Actions or Vercel were used for acceptance.
