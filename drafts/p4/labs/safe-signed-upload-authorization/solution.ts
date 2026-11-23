// Server-side endpoint: actor is verified from Auth + membership DB.
async function issueUpload(
  actor: { userId: string; tenantId: string; canUpload: boolean },
  documentId: string,
) {
  if (!actor.userId || !actor.tenantId || !actor.canUpload)
    throw new Error("Forbidden");
  if (!/^[a-f0-9-]{36}$/i.test(documentId))
    throw new Error("Invalid ID");
  // The server chooses the full key; never accept a client-supplied path.
  const key = actor.userId + "/" + documentId + ".pdf";
  const { data, error } = await service.storage
    .from("academy_private_docs").createSignedUploadUrl(key);
  if (error || !data) throw new Error("Upload authorization failed");
  return { path: data.path, token: data.token };
}
