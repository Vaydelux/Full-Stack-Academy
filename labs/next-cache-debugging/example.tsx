// Example Route Handler; diagnostic headers should not expose private cache-key contents.
export async function GET(){return Response.json({source:'public-catalog'},{headers:{'Cache-Control':'public, max-age=0, must-revalidate','X-Academy-Cache-Policy':'explicit'}});}
