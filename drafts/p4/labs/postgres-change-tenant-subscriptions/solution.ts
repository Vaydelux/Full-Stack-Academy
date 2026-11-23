const verifiedTenantId = activeTenant.id; // obtained from trusted auth
const channel = supabase.channel("tasks:" + verifiedTenantId)
 .on("postgres_changes", {
   event: "*", schema: "public", table: "tasks",
   filter: "tenant_id=eq." + verifiedTenantId,
 }, payload => invalidateTaskQueryCache(payload))
 .subscribe();
// Ensure tasks RLS enforces membership; removeChannel on unmount.
