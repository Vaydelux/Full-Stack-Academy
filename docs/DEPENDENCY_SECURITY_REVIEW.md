# Dependency security review — 2026-11-18
## Evidence
- GitHub Actions run 44240847936, job 134588124106: npm audit --omit=dev reports zero findings at all severities; full audit reports 14 high, zero critical.
- All affected lockfile nodes have dev:true, including both picomatch versions 2.3.2 and 4.0.7.
- The fourteen findings trace to one root advisory: [GHSA-fc5q-39xc-vjpf / CVE-2026-112366](https://osv.dev/vulnerability/GHSA-fc5q-39xc-vjpf), a regular-expression denial-of-service issue for crafted repeated extglobs. Affected versions are <=4.0.7; no patched version was listed at review.
- npm suggests a breaking downgrade of eslint-config-next to 14.2.35. Do not apply an automatic forced downgrade to a Next.js 16 project.

## Scope and controls
The reported vulnerable packages are lint/build tools, not the audited runtime npm dependency graph. The application's curriculum search uses literal substring matching; the course does not expose glob compilation to users. ESLint is invoked with a fixed target and repository-owned config/ignore patterns. Run verification in read-only GitHub Actions jobs with timeouts; do not enable privileged pull_request_target runs for arbitrary PR code. Keep package versions locked and use npm ci. Do not run lint or glob compilation on user-provided search patterns or remote learner code. Build tooling may still be attacked through malicious patterns in reviewed source/configuration: this risk is not eliminated by the runtime audit.

## Temporary exception
Do not claim zero vulnerabilities overall. The known dev-only advisory tree is accepted for this release candidate until 2026-12-02 UTC inclusive, with an explicit package allowlist, exact advisory URL, and lockfile dev-only checks. The audit must fail on a new high/critical advisory, unknown affected node, critical issue, runtime high/critical issue, expiry, or unavailable result. No blanket suppression, force fix, or dependency downgrade. Upgrade to a compatible fixed package when published, retest lint/build/browser workflows, and remove the exception. This is a scoped mitigation, not a patch, and the current runtime report does not prove absence of other security issues.

## Follow-up
Review the advisory by 2026-12-02 or earlier if a compatible fix appears. Review any newly reported build/CI vulnerability before release. Browser sandbox isolation and network limitations remain independent security considerations.
