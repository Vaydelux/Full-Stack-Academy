# P7 Platforms, Enterprise and Capstones

17 module-level teaching models support 136 distinct manuscripts in `drafts/p7-platforms` (Tracks 24–25) and `drafts/p7-enterprise` (Tracks 26–27).

```bash
node --test examples/p7-platforms/labs.test.mjs examples/p7-platforms/verify-track.test.mjs
npm run test:p7-source
```

The first command runs 42 model tests and 11 synthetic manuscript-auditor fixtures without third-party packages. The second additionally reads the actual complete checkout and publication metadata. These are small deterministic models, not production implementations: command checks do not enforce native capabilities; operation IDs are only in-memory; citation membership does not prove answer grounding; claims are assumed already verified; entitlement is a hypothetical paid-through policy; retention produces candidates for review, not deletion; capstone booleans are rubric inputs, not independently verified evidence.

| Track | Models |
|---|---|
| 24 | bridgeAllowed, applyOperation, desktopAllowed, resumeQueue |
| 25 | aggregateEvents, citedAnswer, validPoint, mediaAllowed |
| 26 | enterpriseAccess, entitlement, retentionDecision, adminAllowed |
| 27 | webAcceptance, apiAcceptance, workspaceAcceptance, productionAcceptance, defenseAcceptance |

Perform the individual manuscript exercises on real, authorized disposable tools before publication. See the capstone project specification and final authoring checkpoint.

## Executable capstone vertical
The companion `examples/p7-runtime` uses real SQLite files, independent child processes and loopback HTTP to exercise offline sync, membership/entitlements, tenant-scoped search, audit and restore. Run `npm run test:p7-runtime`. It does not certify native bridges, provider identity, AI grounding or mobile/device quality; retain all module-specific gates.
