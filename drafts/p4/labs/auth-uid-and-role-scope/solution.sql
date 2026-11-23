ALTER TABLE public.academy_lab_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY lab_tasks_authenticated_owner ON public.academy_lab_tasks
 FOR SELECT TO authenticated
 USING ((SELECT auth.uid()) IS NOT NULL
   AND owner_id = (SELECT auth.uid()));
