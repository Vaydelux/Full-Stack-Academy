// Unsafe: a server component trusts a decoded cookie without checking Auth.
const raw = request.cookies.get("user")?.value;
return JSON.parse(raw ?? "{}").isAdmin;
