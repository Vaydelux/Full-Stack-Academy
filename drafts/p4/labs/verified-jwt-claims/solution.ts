const { data, error } = await supabase.auth.getClaims();
if (error || !data?.claims?.sub)
  throw new Error("Unauthenticated");
const userId = data.claims.sub;
// For sensitive revocation-dependent operations, fetch fresh user/session info.
const fresh = await supabase.auth.getUser();
if (fresh.error || fresh.data.user?.id !== userId)
  throw new Error("Session invalid");
// Authorization still requires trusted server membership/permission lookup.
