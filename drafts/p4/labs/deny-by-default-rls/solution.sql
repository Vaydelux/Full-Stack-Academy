ALTER TABLE public.academy_lab_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY lab_tasks_owner_read ON public.academy_lab_tasks
 FOR SELECT TO authenticated
 USING (owner_id = (SELECT auth.uid()));
