const { data, error } = await supabase.auth.signUp({ email, password });
if (error) throw new Error("Sign-up failed");
if (!data.session) {
  return { state: "verify-email" as const };
}
return { state: "signed-in" as const, userId: data.session.user.id };
