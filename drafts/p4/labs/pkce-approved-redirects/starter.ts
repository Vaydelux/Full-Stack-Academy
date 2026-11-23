// An attacker may supply their own redirect URL.
await supabase.auth.signInWithOAuth({
  provider: "google", options: { redirectTo: suppliedRedirect },
});
