# Academy P5 Security Foundations Source Checkpoint — 2026-11-23

Based on main `d5a393fcd8d5be98464bbc1f099a4ae7730c3a60` (merged PR #45), this change stages eight previously unstarted 15.01 manuscripts under `drafts/security/lessons/` and makes **no** publication-registry, deployment, workflow, dependency or learner-progress changes.

## Source accounting

| Measure | Before | This batch |
|---|---:|---:|
| Canonical topics | 889 | 889 |
| Published topics | 338 | 338 |
| Source-authored unpublished drafts | 152 | 160 |
| Topics not source-authored | 399 | 391 |
| P5 module 15.01 manuscripts | 0 | 8 |

Each manuscript has a scenario, three steps, a failure, correction, practice task, misconception, four-question assessment and official sources. **This is source authoring, not runtime validation.** The parent P1–P4 blockers described in `docs/NEXT_TODO.md` remain open.

## Next work in priority order

1. Complete the Node 24 full checkout and real runtime qualification for earlier P1–P4 release candidates; keep Vercel Git deployments disabled.
2. Add runnable, isolated P5 15.01 labs for object-level authorization, missing-policy denial, log redaction, and signed upload cross-tenant checks.
3. Run static curriculum-ID/MDX source QA and review the current OWASP ASVS control mapping; distinguish reference guidance from executed compliance evidence.
4. Add future P5 15.02–15.04 manuscripts with separate starter/solution tests and security review.
5. Publish only after independent technical, editorial, usability and accessibility acceptance in phase order.

No automated workflow or deployment was requested or initiated by this content batch. A GitHub merge itself can still invoke external integrations if repository/project settings change; keep the explicit deploy freeze in effect.
