# Full-Stack Academy — Next TODO

**Development checkpoint:** full canonical Git/Collaboration/Monorepos track `05.01`–`05.03` (24 lessons) authored on `feat/05-git-monorepo-offline`. **No Vercel deploy**, no merge. Baseline production remains 61 published lesson IDs.

## P0 — Verify full Git track on its exact branch HEAD

- [x] `05.01 — Everyday Git`: eight lessons with temporary local repositories; real status/index/commit history, merge ancestry, revert vs reset, bare-remote push, conflict resolution, .gitignore and feature capstone
- [x] `05.02 — Team Engineering`: trunk age/review policies, conventional commits, simplified CODEOWNERS, review comments, exact-SHA CI checks, stable SemVer, changelogs, tracked-secret remediation with real Git history
- [x] `05.03 — pnpm & Turborepo`: workspaces, public package exports, shared TS config, graph ordering, cache keys, direct-lockfile checks, upgrade policy and 3-package shared-contract capstone
- [x] Twenty-four full MDX lessons and metadata, red starter/green instructor exercise modules, independent lab tests, new package/TypeScript capstone fixtures and browser route checks
- [x] Publish registries, lab commands, content checkpoint and long-scope handoff updated; **all are branch-only**
- [x] Prior exact-head CI passed at `88326b5` — run [44371495933](https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44371495933): lint, strict types, content/checkpoint, 322 local lab tests, 18 repo tests, Next build and all Chromium smoke
- [x] Add automated red-starter checks for all 24 new labs against disposable local fixtures; run in final exact-head CI
- [ ] Pass final exact-head CI with the newly added red-starter gate
- [x] Keep PR #14 and #15 unmerged; open [draft PR #16](https://github.com/Vaydelux/Full-Stack-Academy/pull/16) for track 05 with zero Vercel feature deployments

## P1 — Large-scope React + Next.js program

- [ ] `06.01–06.05` React (40 canonical topic IDs, **one already-authored interactive sample** `06.01.01`); create or deepen 39 remaining topics with DOM/component tests and realistic sample apps
- [ ] `07.01–07.05` Next.js App Router & SEO (40 canonical topics), focusing on route/layout/data/caching/auth/server-client runtime behavior with isolated demos
- [ ] Combined track `05–07` program covers **104 canonical IDs**, of which **24 Git IDs now authored here**, one existing React JSX sample, and 79 additional React+Next lessons remain planned
- [ ] Scope/checkpoint by complete modules or tracks, not tiny releases; keep one exact-head quality gate for each batch
- [ ] Expand encyclopedia: 303 reference index subjects but only 4 authored reference drafts

## P2 — Security and eventual release

- [ ] Revisit **14 high dev-only Picomatch audit findings** before exception expiry **2026-12-02 UTC**; no broad dependency upgrade without verification
- [ ] Real screen readers, keyboard and 200% zoom, performance trace, real pnpm install and Turbo cache verification remain untested release conditions
- [ ] Resume Vercel only when explicitly requested. A passing GitHub CI job is **not** a hosted release; do not merge or deploy while hold stands

**Branch candidate snapshot:** 181 published IDs (178 MDX, 178 local labs), 22 complete modules, 889 catalog topic IDs, 708 catalog IDs planned. **Live baseline: 61 published IDs.** See `docs/GIT_TRACK_ACCEPTANCE.md` and `docs/LONG_SCOPE_DELIVERY_PLAN.md`.
