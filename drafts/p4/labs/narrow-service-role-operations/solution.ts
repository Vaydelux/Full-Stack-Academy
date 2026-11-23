import "server-only";
import { createClient } from "@supabase/supabase-js";
// actor must have been resolved from verified Auth + trusted server DB membership.
async function moderateDocument(
  actor: { id: string; tenantId: string; canModerate: boolean },
  documentId: string,
) {
  if (!actor.id || !actor.tenantId || !actor.canModerate || !documentId)
    throw new Error("Forbidden");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Missing server credentials");
  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await admin.from("documents")
    .update({ active: false })
    .eq("id", documentId)
    .eq("tenant_id", actor.tenantId);
  if (error) throw new Error("Moderation failed");
}
