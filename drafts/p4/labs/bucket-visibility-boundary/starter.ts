// Wrong for private documents: a public bucket exposes object URLs.
await supabase.storage.createBucket("academy_private_docs", {
  public: true,
});
