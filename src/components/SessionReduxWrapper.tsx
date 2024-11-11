'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '@/lib/github/tokenManager';
import AccessTokenSync from './AccessTokenSync';

export default function SessionReduxWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <AccessTokenSync />
        {children}
      </Provider>
    </SessionProvider>
  );
}
