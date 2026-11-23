import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function serverSupabase() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(toSet) {
        // Cookie writes belong in a Server Action, Route Handler or refresh Proxy.
        try { toSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)); }
        catch { /* Read-only Server Component: configured Proxy refreshes */ }
      },
    },
  });
}
