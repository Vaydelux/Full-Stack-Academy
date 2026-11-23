# P5 Security — dependency-free example

Run `node --test examples/p5-security/policy.test.mjs` on Node 22+. The full Academy release gate still requires Node 24.

The exercise has a positive and negative multi-tenant policy matrix, revoked membership and locked/deleted record handling, audit field allowlisting, and a **static HTTPS hostname filter**.

**Not production security middleware:** the filter is not SSRF protection. Real URL fetchers must validate IPs at connection time, recheck redirects, resist rebinding, control proxy usage and enforce egress policies. The policy helper also assumes already-authenticated server-owned membership; real database authorization requires authenticated HTTP and persistence integration tests. Do not use teaching code for production access checks or deploy intentionally broken teaching examples.
