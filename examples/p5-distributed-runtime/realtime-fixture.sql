-- Manual test fixture ONLY on an independent local stack after p4-runtime/supabase/fixture.sql.
-- Do not apply to hosted or shared projects. No global policy removal.
BEGIN;
CREATE POLICY academy_runtime_broadcast_read ON realtime.messages FOR SELECT TO authenticated
 USING (extension='broadcast' AND (SELECT realtime.topic())='academy-runtime:'||(SELECT auth.uid())::text);
CREATE POLICY academy_runtime_broadcast_write ON realtime.messages FOR INSERT TO authenticated
 WITH CHECK (extension='broadcast' AND (SELECT realtime.topic())='academy-runtime:'||(SELECT auth.uid())::text);
COMMIT;
