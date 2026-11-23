const payload = JSON.parse(
  atob(token.split(".")[1]),
);
// Wrong: decoding is not signature verification.
if (payload.app_metadata?.role === "admin") allowAdmin();
