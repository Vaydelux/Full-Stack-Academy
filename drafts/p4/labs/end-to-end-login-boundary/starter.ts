const session = await supabase.auth.getSession();
const isAdmin = session.data.session?.user.user_metadata?.isAdmin;
if (isAdmin) return listAllTenants();
