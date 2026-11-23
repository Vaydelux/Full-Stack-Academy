// User-controlled headers do not prove file bytes or safety.
if (file.type === "application/pdf") {
  await supabase.storage.from("academy_private_docs")
    .upload(file.name, file);
}
