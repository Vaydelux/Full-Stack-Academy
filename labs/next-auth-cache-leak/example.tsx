import {cookies} from 'next/headers';
// Teaching fixture: no identity provider is wired, so the verifier denies every request.
// Replace this with a real server-side session verifier and permission check before releasing.
async function verifyAuthorizedSession(_token:string|undefined):Promise<boolean>{return false;}
export async function GET(){const token=(await cookies()).get('session')?.value;if(!await verifyAuthorizedSession(token))return Response.json({error:'unauthorized'},{status:401,headers:{'Cache-Control':'private, no-store'}});return Response.json({message:'Authorized session'},{headers:{'Cache-Control':'private, no-store'}});}
