import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const appSans = Plus_Jakarta_Sans({
  variable: '--font-app-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const appMono = JetBrains_Mono({
  variable: '--font-app-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Full-Stack Engineering Academy · v1.1',
  description:
    'Enterprise full-stack curriculum workspace: 28 tracks, 111 modules, 889 planned topics, 303 indexed references, and interactive authored sample labs.',
};

export const viewport: Viewport = {
  themeColor: '#090A0F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${appSans.variable} ${appMono.variable} antialiased overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
