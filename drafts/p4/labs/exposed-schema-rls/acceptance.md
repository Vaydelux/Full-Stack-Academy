# 14.01.05 — separate, not-yet-executed integration verification

## Positive integration test
Apply this SQL only to a disposable Supabase local stack with auth.uid available. Run SQL policy tests as authenticated and anon roles plus actual API requests; check Data API schema exposure settings.

## Negative unauthorized or unsafe case
With two authenticated test users, confirm each sees only their own notes and the other sees zero rows; anon must not read private data.

## Privilege and environment boundary
TO authenticated alone is not authorization. Security-definer views/functions and privileged service roles can bypass row policies, so review those separately.

Use a dedicated Supabase local stack and two synthetic users. Do not execute the examples on live projects, use production keys, or claim source audit results establish RLS protection. Confirm current CLI versions and run independent data API tests.
