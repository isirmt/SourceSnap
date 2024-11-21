'use client';

import { signIn } from 'next-auth/react';
import { AuthProvider } from '@/app/signin/page';

export default function SignInButton({ provider }: { provider: AuthProvider }) {
  return (
    <button
      onClick={() => {
        signIn(provider.id);
      }}
      className='rounded-md bg-black px-4 py-2 text-xl font-bold text-white drop-shadow-xl transition-colors hover:bg-gray-800'
    >
      Sign in with {provider.name}
    </button>
  );
}
