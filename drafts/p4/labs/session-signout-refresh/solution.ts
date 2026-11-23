const { error } = await supabase.auth.signOut({ scope: "global" });
if (error) throw new Error("Sign-out failed");
// Clear application-only cached private state after successful sign-out.
await queryClient.clear();
// Server routes still validate fresh session and resource authorization.
