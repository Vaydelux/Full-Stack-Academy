CREATE POLICY lab_tasks_authenticated_read ON public.academy_lab_tasks
 FOR SELECT TO authenticated USING (true);
