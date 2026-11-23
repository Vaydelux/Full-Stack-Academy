# 14.01.08 — separate, not-yet-executed integration verification

## Positive integration test
On a machine with Docker and the current CLI, run the local stack, seed two users, verify the Data API denies forbidden access, and tear down the disposable stack.

## Negative unauthorized or unsafe case
Remove required Docker service and confirm startup reports the dependency rather than switching to a remote project; refuse linked remote credentials in the lab.

## Privilege and environment boundary
supabase db reset is destructive to the local database. Never aim training operations at an existing production or shared testing project.

Use a dedicated Supabase local stack and two synthetic users. Do not execute the examples on live projects, use production keys, or claim source audit results establish RLS protection. Confirm current CLI versions and run independent data API tests.
