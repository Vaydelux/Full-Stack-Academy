// Example file: app/api/products/route.ts
export async function GET(request:Request){const url=new URL(request.url);const id=url.searchParams.get('id');if(!id||!/^[a-z0-9-]{1,50}$/.test(id))return Response.json({error:'invalid-id'},{status:400});return Response.json({id,available:true},{headers:{'Cache-Control':'private, no-store'}});}
