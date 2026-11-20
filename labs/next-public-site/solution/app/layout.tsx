import type {ReactNode} from 'react';
import Link from 'next/link';
export const metadata={title:'Learning Store',description:'A public catalogue used for local App Router practice'};
export default function RootLayout({children}:{children:ReactNode}) {
 return <html lang="en"><body><header><nav aria-label="Primary navigation"><Link href="/">Learning Store</Link></nav></header>{children}</body></html>;
}
