// Unsafe: arbitrary path and public bucket, immediate exposure.
await supabase.storage.from("public-files").upload(body.path, body.file);
await prisma.document.create({ data: {
  tenantId: body.tenantId, path: body.path,
}});
