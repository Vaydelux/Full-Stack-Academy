function mapDatabaseError(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (code === "P2002") return { status: 409, error: "Conflict" };
    if (code === "P2025") return { status: 404, error: "Not found" };
  }
  return { status: 500, error: "Request failed" };
}
try { await createTask(); }
catch (error) {
  console.error("Database request failed", { event: "task.create.failed" });
  return mapDatabaseError(error);
}
