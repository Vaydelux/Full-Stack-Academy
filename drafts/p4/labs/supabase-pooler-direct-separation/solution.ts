function required(name: "DATABASE_DIRECT_URL" | "DATABASE_POOL_URL") {
  const value = process.env[name];
  if (!value) throw new Error("Missing " + name);
  return value;
}
export const dbEndpoints = {
  migrations: required("DATABASE_DIRECT_URL"),
  runtime: required("DATABASE_POOL_URL"),
};
