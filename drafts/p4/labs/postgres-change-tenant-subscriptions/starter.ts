// Subscribes broadly to data changes without a tenant filter.
const channel = supabase.channel("all-tasks")
 .on("postgres_changes", { event: "*", schema: "public",
   table: "tasks" }, payload => render(payload.new))
 .subscribe();
