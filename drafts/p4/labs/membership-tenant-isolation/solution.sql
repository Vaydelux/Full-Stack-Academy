ALTER TABLE public.academy_lab_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY lab_own_memberships ON public.academy_lab_memberships
 FOR SELECT TO authenticated
 USING (user_id = (SELECT auth.uid()));

ALTER TABLE public.academy_lab_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY lab_member_tenant_read ON public.academy_lab_tasks
 FOR SELECT TO authenticated
 USING (EXISTS (
   SELECT 1 FROM public.academy_lab_memberships m
   WHERE m.tenant_id = academy_lab_tasks.tenant_id
     AND m.user_id = (SELECT auth.uid())
  ));
