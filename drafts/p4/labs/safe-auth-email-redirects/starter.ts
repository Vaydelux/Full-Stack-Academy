await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: request.query.redirectTo as string,
});
