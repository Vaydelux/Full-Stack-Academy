import {cookies} from 'next/headers';
// Server request boundary: do not return or cache the cookie value in public HTML.
export async function getSessionPresence(){const jar=await cookies();return Boolean(jar.get('session'));}
