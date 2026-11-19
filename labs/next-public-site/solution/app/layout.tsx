import type {ReactNode} from 'react';
export const metadata={title:'Learning Store',description:'A public catalogue used for local App Router practice'};
export default function RootLayout({children}:{children:ReactNode}) {
 return <html lang="en"><body><header><nav aria-label="Primary navigation"><a href="/">Learning Store</a></nav></header>{children}</body></html>;
}
