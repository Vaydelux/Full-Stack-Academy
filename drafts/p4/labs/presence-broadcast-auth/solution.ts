// Server-derived tenant and Auth JWT; authorization policy required.
const channel = supabase.channel("tenant:" + verifiedTenantId, {
  config: { private: true, presence: { key: verifiedUserId } },
});
channel.on("presence", { event: "sync" }, () => {
  renderMembers(channel.presenceState());
});
channel.on("broadcast", { event: "task.changed" }, () => {
  invalidateTaskQueryCache();
});
channel.subscribe();
// Remove channel and clear presence on logout/unmount.
