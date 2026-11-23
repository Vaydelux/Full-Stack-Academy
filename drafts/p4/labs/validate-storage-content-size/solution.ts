const maxBytes = 5 * 1024 * 1024;
const allowed = new Set(["application/pdf", "image/png"]);
if (file.size <= 0 || file.size > maxBytes || !allowed.has(file.type))
  throw new Error("Rejected upload");
// On the server, independently sniff actual bytes, validate filename/path,
// scan or quarantine untrusted content, and verify the active bucket limit.
const safePath = verifiedUserId + "/" + crypto.randomUUID();
const { error } = await supabase.storage
  .from("academy_private_docs").upload(safePath, file, {
    contentType: file.type,
    upsert: false,
  });
if (error) throw new Error("Upload failed");
