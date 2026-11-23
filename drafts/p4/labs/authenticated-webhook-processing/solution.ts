// The delivery provider must be configured for a signed secret header.
// Verify HMAC over RAW bytes; adapt header/signature format to provider.
function verify(body: Buffer, suppliedHex: string, secret: string) {
  const expected = createHmac("sha256", secret).update(body).digest();
  const got = Buffer.from(suppliedHex, "hex");
  return got.length === expected.length && timingSafeEqual(got, expected);
}
async function acceptWebhook(rawBody: Buffer, signature: string) {
  if (!verify(rawBody, signature, requiredSecret))
    throw new Error("Unauthorized webhook");
  // Parse ONLY the verified bytes; never accept a separate caller event.
  const parsed: unknown = JSON.parse(rawBody.toString("utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new Error("Invalid event");
  const event = parsed as { id?: unknown; tenantId?: unknown };
  if (typeof event.id !== "string" || !event.id ||
      typeof event.tenantId !== "string" || !event.tenantId)
    throw new Error("Invalid event");
  await processOnceWithDatabaseUniqueEventId(event);
}
