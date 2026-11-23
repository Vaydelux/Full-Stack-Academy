const { data } = await supabase.auth.signUp({ email, password });
if (data.user) window.location.assign("/dashboard");
