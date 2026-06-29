import { Banner } from 'fumadocs-ui/components/banner';
import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  icons: {
    icon: '/favicon.ico',
  },
};


export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Banner variant="rainbow">
          <div className="text-xs sm:text-base">
            Integrate Reclaim Protocol end to end using{' '}
            <a href="/agents" className="underline">
              our agent
            </a>
          </div>
        </Banner>
        <RootProvider>
          {children}
          <Analytics />
        </RootProvider>
      </body>
    </html>
  );
}
