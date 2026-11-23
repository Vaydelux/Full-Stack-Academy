// Wrong: initiating enrollment is not the same as verifying the factor.
await supabase.auth.mfa.enroll({ factorType: "totp" });
const mfaVerified = true;
