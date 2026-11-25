# F10.2 — Typed HTTP client runtime qualification

Baseline a3ab78ea538d1d91b891a7642643a9fefbb9b9e3. The typed API client (original blob 360acc82526fe252b9e24e12829fd84e6aa90608) and policy were reconstructed exactly from GitHub. Six of eight new tests failed on the original, using real local HTTP peers, and all eight passed after the fix.

## Reproduced defects and repair
- Structurally valid create acknowledgements could represent a different payload or initial state. Validate normalized title, priority, initial todo state and revision one; preserve original same-key replay semantics.
- PATCH accepted incorrect status or revision acknowledgements. Require requested status and either unchanged or one-step revision (no-op permitted).
- Valid-shaped JSON with arbitrary oversized extra fields was accepted; stream and cap decoded success bytes at 64 KiB and optional error bytes at 8 KiB, cancel unused/rejected bodies.
- Invalid UTF-8 could silently turn into replacement characters; fatal streaming TextDecoder rejects it.
- Excessive HTTP error messages could be reflected; retain the known status and cap displayed title at 256 code units, otherwise use HTTP status.
- A success-body cancellation after headers could lose the supplied abort reason. Check the caller signal before and during consumption.

These limits apply to the bounded teaching API; they are not a global application policy. No new elapsed-time deadline is implemented; callers still supply cancellation signals and a custom abort reason not named AbortError is not necessarily classified as cancellation by the existing retry predicate. This patch does not prove actual React rendering, dependency installation, RHF validation, TanStack cache behavior or production network safety.

## Verification
Eight new Node24.11.1 real HTTP cases passed after repair; the previous 49 HTTP/resilience/lifecycle/shutdown tests also passed. Existing error-body cancellation (3), cancellation policy (5) and query policy (12) were included in the local subset run. 77 total passed, none skipped. All new cases are wired into test:forms-query-react-api and qualify:forms-query source/full. A complete checkout, root build and browser run remain blocked; no lesson publication or deployment changed. The next action is full P1 qualification on a workstation with genuine installed dependencies and working local browser navigation. 338/889 remains published.
