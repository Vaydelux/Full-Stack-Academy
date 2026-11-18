# Git / Collaboration / Monorepos — Offline Track Acceptance

**Branch:** `feat/05-git-monorepo-offline` · **Scope:** 24 lesson IDs · **Release status:** draft/unmerged/no Vercel deployment.

| Module | Lessons | Evidence |
|---|---:|---|
| 05.01 Everyday Git | 8 | Real Git CLI in disposable repositories: file index, history, branches, merge/revert, local bare remote, conflict resolution, untracked fake environment, feature capstone |
| 05.02 Team Engineering | 8 | Explicit review, exact SHA, SemVer/changelog, CODEOWNERS policy assertions; tracked fake-secret remediation includes real Git state and historical exposure |
| 05.03 pnpm & Turborepo | 8 | Static workspace/exports/config/task/cache/lock/version checks; capstone compiles shared contracts used by actual TypeScript API and web source |

## Evidence requirements

- [x] All 24 MDX bodies include 3 guided steps, misconception, quiz, bug hunt, two official HTTPS sources and local lab manifest.
- [x] Every starter has a teachable defect; checked-in instructor code has independently assertable outcomes.
- [x] Git operations run in new temporary repositories via `labs/git-sandbox/harness.mjs`. The helper restricts network protocols and cleans directories.
- [x] Local policy examples document deliberate simplifications (e.g. CODEOWNERS globs, lock snapshot vs actual pnpm-lock).
- [x] TypeScript workspace capstone includes real modules, manifests, actual compiler and runtime tests; external pnpm/ Turbo commands are not claimed.
- [ ] Exact HEAD CI must pass locked install, lint, TS typecheck, content, checkpoint, full labs, Next build, Chromium.
- [ ] Review actual browser lesson visibility/noindex and existing CSS and JS/TS regressions.
- [ ] Manual/editorial accessibility evaluation and actual pnpm workspace install are separate release gates.
- [ ] Confirm zero Vercel feature deployments, leave draft PRs unmerged, preserve production SHA.

## Nonclaims and risk register

- The local repo harness executes lesson JS in Node and is **not** a security sandbox for code supplied by untrusted people. The git CLI and host API have been intentionally scoped for educational CI only.
- No hosted PR approval, CODEOWNERS enforcement, GitHub branch-protection setup, real registry lookups or npm publication is performed.
- A .gitignore update cannot remove synthetic or real committed secrets from history. Real exposure demands credential rotation and coordinated history remediation.
- This branch adds 24 IDs to prior unmerged work, so published `181` means branch candidate, **not live production**.
- The existing dev-tool Picomatch exception expires `2026-12-02 UTC`.
