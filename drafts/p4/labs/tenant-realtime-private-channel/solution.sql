-- Assumes public.academy_realtime_memberships with tenant_id/user_id.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY academy_tenant_broadcast_read ON realtime.messages
FOR SELECT TO authenticated
USING (
  extension = 'broadcast'
  AND EXISTS (
    SELECT 1 FROM public.academy_realtime_memberships m
    WHERE m.user_id = (SELECT auth.uid())
      AND m.tenant_id = split_part((SELECT realtime.topic()), ':', 2)
  )
);
-- A separate scoped INSERT policy is required for sending.
-- Client joins with config: { private: true }.
