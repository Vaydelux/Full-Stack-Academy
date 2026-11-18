import {NextResponse,type NextRequest} from 'next/server';
// Example file: proxy.ts (Next.js 16)
export function proxy(_request:NextRequest){const response=NextResponse.next();response.headers.set('X-Content-Type-Options','nosniff');response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');return response;}
export const config={matcher:['/dashboard/:path*']};
