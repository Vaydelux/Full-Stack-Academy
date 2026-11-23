// Unsafe: browser code must never construct a privileged service client.
const admin = createClient(publicUrl, process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!);
await admin.from("documents").update({ active: false }).eq("id", documentId);
