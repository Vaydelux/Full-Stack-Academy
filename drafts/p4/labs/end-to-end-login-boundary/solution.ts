const { data: identity, error } = await supabase.auth.getUser();
if (error || !identity.user) throw new Error("Unauthenticated");
const { data: membership, error: membershipError } = await supabase
  .from("memberships")
  .select("tenant_id, role")
  .eq("user_id", identity.user.id)
  .eq("tenant_id", verifiedTenantId)
  .maybeSingle();
if (membershipError || !membership) throw new Error("Forbidden");
// Memberships table itself must have an RLS ownership policy.
return { userId: identity.user.id, tenantId: membership.tenant_id,
  role: membership.role };
