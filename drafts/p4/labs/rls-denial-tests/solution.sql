-- Isolated local Supabase test only; two synthetic owners are seeded.
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
DO $test$
DECLARE allowed_rows integer; denied_rows integer;
BEGIN
  SELECT count(*) INTO allowed_rows FROM public.academy_lab_tasks
    WHERE owner_id = '11111111-1111-4111-8111-111111111111'::uuid;
  SELECT count(*) INTO denied_rows FROM public.academy_lab_tasks
    WHERE owner_id = '22222222-2222-4222-8222-222222222222'::uuid;
  IF allowed_rows <> 1 OR denied_rows <> 0 THEN
    RAISE EXCEPTION '14.03.03 RLS allow/deny matrix failed';
  END IF;
END $test$;
ROLLBACK;
