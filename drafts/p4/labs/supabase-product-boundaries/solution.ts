// Browser client: URL + publishable key only.
import { createBrowserClient } from "@supabase/ssr";
export function browserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Public Supabase config missing");
  return createBrowserClient(url, key);
}
// Service-only privileged clients belong in separate server modules.
