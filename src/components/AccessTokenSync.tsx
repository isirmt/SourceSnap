'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '@/lib/github/tokenManager';

export default function AccessTokenSync() {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.access_token) {
      dispatch(setAccessToken(session.access_token!));
    }
  }, [session, dispatch]);

  return null;
}
