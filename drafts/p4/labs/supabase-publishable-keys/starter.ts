// CRITICAL: never ship a secret key in NEXT_PUBLIC variables.
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!,
);
