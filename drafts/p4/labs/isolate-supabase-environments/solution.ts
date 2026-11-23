export function requireTestProjectUrl() {
  const value = process.env.SUPABASE_TEST_URL;
  if (!value) throw new Error("SUPABASE_TEST_URL is required");
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:")
    throw new Error("Invalid project URL");
  // Require an explicit test-only project reference approved by the operator.
  if (process.env.ACADEMY_TEST_PROJECT_APPROVED !== "YES")
    throw new Error("Test project approval required");
  return url.toString();
}
