// Wrong: one privileged client is reused in every runtime.
import { createClient } from "@supabase/supabase-js";
export const sharedClient = createClient(url, secretKey);
