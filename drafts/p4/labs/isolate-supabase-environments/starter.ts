// Risky: silently falls back to the live project.
export const supabaseUrl =
  process.env.SUPABASE_TEST_URL ?? "https://production-project.supabase.co";
