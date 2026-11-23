import { createBrowserClient } from "@supabase/ssr";
const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!projectUrl || !publishable) throw new Error("Missing browser config");
export const client = createBrowserClient(projectUrl, publishable);
