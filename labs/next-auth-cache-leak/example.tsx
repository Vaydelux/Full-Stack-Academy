import {cookies} from 'next/headers';
// Example private Route Handler. A real session parser and authorization check are required.
export async function GET(){const session=(await cookies()).get('session')?.value;if(!session)return Response.json({error:'unauthorized'},{status:401,headers:{'Cache-Control':'private, no-store'}});return Response.json({message:'Authenticated boundary reached'},{headers:{'Cache-Control':'private, no-store'}});}
