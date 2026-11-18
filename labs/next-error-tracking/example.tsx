// Example server-safe error normalization (report to an approved logger separately).
export function publicErrorResponse(_error:unknown){return Response.json({error:'internal-error',message:'Please try again later.'},{status:500,headers:{'Cache-Control':'no-store'}});}
