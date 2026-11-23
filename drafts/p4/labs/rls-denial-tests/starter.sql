-- In a local test transaction: one positive result is not a security test.
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
SELECT count(*) FROM public.academy_lab_tasks;
ROLLBACK;
