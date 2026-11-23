const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN;
if (!appOrigin) throw new Error("Missing app origin");
const redirectTo = new URL("/auth/callback", appOrigin).toString();
const { error } = await supabase.auth.signInWithOAuth({
  provider: "google", options: { redirectTo },
});
if (error) throw new Error("Unable to start sign-in");
// Handle code exchange in the dedicated, trusted callback route.
