/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Session } from 'next-auth';
import { auth } from '@/lib/auth';
import { ArrowDownBlock } from './ArrowBlock';
import SessionButton from './SessionButton';

export async function Header() {
  const session: Session | null = await auth();
  return (
    <header className='flex h-12 w-full justify-center border-b border-slate-300 bg-slate-100'>
      <div className='flex h-full w-full max-w-[72rem] items-stretch justify-between px-4'>
        <a href='/tree' className='flex items-center text-xl font-bold text-slate-800'>
          Tree Downloader
        </a>

        <div className='group relative flex h-auto cursor-pointer items-stretch'>
          <div className='flex items-center gap-1 px-2 text-slate-800 group-hover:bg-slate-200'>
            {session ? (
              <React.Fragment>
                <img alt='user-icon' src={session.user.image!} className='size-8 rounded-full' />
                {session.user.id}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className='size-8 rounded-full bg-slate-300' />
                Not signed in
              </React.Fragment>
            )}
            <ArrowDownBlock />
          </div>
          <div className='absolute right-0 top-10 hidden cursor-auto rounded border bg-slate-50 px-3 shadow group-hover:block'>
            <SessionButton />
          </div>
        </div>
      </div>
    </header>
  );
}
