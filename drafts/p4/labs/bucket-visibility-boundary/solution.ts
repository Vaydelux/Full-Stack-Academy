// Approved local admin setup for a PRIVATE bucket.
const { data, error } = await admin.storage.createBucket(
  "academy_private_docs",
  {
    public: false,
    allowedMimeTypes: ["application/pdf", "image/png"],
    fileSizeLimit: "5MB",
  },
);
if (error) throw new Error("Private bucket setup failed");
// Separately define storage.objects RLS policies before client access.
