import './globals.css';
import React from 'react';
import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

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
          <div className='flex-grow'>{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
