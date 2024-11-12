import './globals.css';
import React from 'react';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { generateMetadataTemplate } from '@/lib/SEO';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataTemplate({});
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='flex flex-col'>
        <Header />
        <div className='flex h-auto min-h-[calc(100svh_-_3rem)] flex-col'>
          <div className='relative flex-grow'>{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
