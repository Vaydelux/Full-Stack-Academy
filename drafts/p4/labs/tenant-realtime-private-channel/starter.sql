-- Unsafe: every authenticated user can join every private topic.
CREATE POLICY academic_open_broadcast ON realtime.messages
FOR SELECT TO authenticated USING (extension = 'broadcast');
