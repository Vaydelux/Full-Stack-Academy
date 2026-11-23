const approvedOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN;
if (!approvedOrigin) throw new Error("Missing app origin");
const redirectTo = new URL("/auth/update-password", approvedOrigin).toString();
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo,
});
if (error) throw new Error("Unable to request password reset");
