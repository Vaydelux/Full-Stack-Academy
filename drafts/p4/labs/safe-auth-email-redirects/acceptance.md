# 14.02.05 — Supabase Auth integration qualification (not run)

## Positive test case
In the local Auth stack, verify email templates, reset links, single-use behavior and redirect allowlisting via Mailpit with synthetic inboxes.

## Forbidden or error case
Supply an attacker domain via a query parameter, including encoded and protocol-relative variants. The reset request must still point to the approved callback.

## Session/authentication boundary
Avoid sensitive info in URLs, referrer headers and analytics. Ensure callback endpoints have no open-redirect forwarding and do not expose token hashes.

Use disposable Supabase local Auth identities and, for SSR examples, a full Next.js dev server with the framework's token refresh Proxy. Do not log tokens, recovery secrets or production account information. This source-only exercise is not accepted as a passed runtime/security gate.
