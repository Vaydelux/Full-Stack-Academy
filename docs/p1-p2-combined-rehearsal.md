# P1–P2 combined publication rehearsal

The formal publication count remains 338. The disposable rehearsal runs P1 to 346 and 354, then projects Nest 11.01–11.04 to 362, 370, 378 and 386. It starts from a clean detached linked worktree, retains all predecessor bytes except shared registries, verifies source-bound candidate packs, checks exact file inventory and regenerated checkpoint counts, and runs the full final offline suite and Chromium acceptance for each Nest module. The isolated PostgreSQL launcher uses an ephemeral restricted database and cleans the worktree/container. Human accessibility review is not performed or implied; fixture dates are never publication evidence. The real apply commands and their clean-checkout/evidence requirements remain unchanged.

Local invocation on Linux with Node 24.9+, Docker, registry access and installed Playwright/Chromium configured via ACADEMY_BROWSER_ROOT:

```bash
bash scripts/qualify-nestjs-isolated.sh --rehearse
```

The existing P1 qualification workflow runs this rehearsal and preserves the log, while the independent P2 runtime job remains unchanged. Do not merge, deploy, or treat the 386 target as published until actual review and guarded apply have succeeded. A failed rehearsal requires repair and rerun on the exact source; no fixture changes should be committed.
