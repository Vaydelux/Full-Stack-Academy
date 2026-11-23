// Public room: anyone who knows a tenant room name can join.
const channel = supabase.channel("tenant:" + tenantId);
channel.subscribe();
