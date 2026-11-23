// The delivery provider must be configured for a signed secret header.
// Verify HMAC over RAW bytes; adapt header/signature format to provider.
function verify(body: Buffer, suppliedHex: string, secret: string) {
  const expected = createHmac("sha256", secret).update(body).digest();
  const got = Buffer.from(suppliedHex, "hex");
  return got.length === expected.length && timingSafeEqual(got, expected);
}
async function acceptWebhook(rawBody: Buffer, signature: string,
                             event: VerifiedEvent) {
  if (!verify(rawBody, signature, requiredSecret))
    throw new Error("Unauthorized webhook");
  if (!event.id || !event.tenantId) throw new Error("Invalid event");
  await processOnceWithDatabaseUniqueEventId(event);
}
