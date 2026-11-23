const enrolled = await supabase.auth.mfa.enroll({ factorType: "totp" });
if (enrolled.error) throw new Error("MFA enrollment failed");
const factorId = enrolled.data.id;
const challenged = await supabase.auth.mfa.challenge({ factorId });
if (challenged.error) throw new Error("MFA challenge failed");
const result = await supabase.auth.mfa.verify({
  factorId, challengeId: challenged.data.id, code: submittedTotpCode,
});
if (result.error) throw new Error("MFA verification failed");
const assurance = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
if (assurance.error || assurance.data?.currentLevel !== "aal2")
  throw new Error("Strong session assurance required");
