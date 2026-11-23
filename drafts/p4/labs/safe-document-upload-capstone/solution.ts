// Teaching excerpt: actor is verified by server Auth and membership.
async function createUploadIntent(actor: VerifiedActor, documentId: string) {
  if (!actor.canWrite || !actor.tenantId || !actor.userId)
    throw new Error("Forbidden");
  const objectPath = actor.userId + "/" + documentId + ".pdf";
  // Durable PENDING row is tenant-scoped and unique by object path.
  await prisma.document.create({ data: {
    tenantId: actor.tenantId, ownerId: actor.userId,
    objectPath, status: "PENDING",
  }});
  const { data, error } = await serverStorage.storage
    .from("academy_private_docs").createSignedUploadUrl(objectPath);
  if (error || !data) throw new Error("Unable to issue upload");
  return { path: data.path, token: data.token };
}
// After upload: verify real bytes + scan and mark READY or clean up.
