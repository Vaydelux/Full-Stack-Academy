function required(name: "DATABASE_DIRECT_URL" | "DATABASE_POOL_URL") {
  const value = process.env[name];
  if (!value) throw new Error(name + " missing");
  return value;
}
// Server-only configuration; never use NEXT_PUBLIC_ for these URLs.
export const databaseConnections = {
  migration: required("DATABASE_DIRECT_URL"),
  runtime: required("DATABASE_POOL_URL"),
};
