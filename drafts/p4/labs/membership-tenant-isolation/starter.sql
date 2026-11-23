ALTER TABLE public.academy_lab_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY lab_any_tenant_read ON public.academy_lab_tasks
 FOR SELECT TO authenticated
 USING (tenant_id IS NOT NULL);
