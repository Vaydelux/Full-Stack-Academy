// Unsafe: the caller controls any object path and receives a signing token.
const { data } = await service.storage
  .from("academy_private_docs")
  .createSignedUploadUrl(request.body.path);
return data;
