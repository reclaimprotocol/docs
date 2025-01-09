import { Banner } from 'fumadocs-ui/components/banner';
import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Banner variant="rainbow">
          ✨Works out of the box guarantee. If you face any issue at all, hit us up&nbsp;<a href="https://t.me/protocolreclaim" target='_blank' className="underline ">on Telegram</a>&nbsp;and we will write the integration for you.
        </Banner>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
