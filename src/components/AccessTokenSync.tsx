'use client'

import { setAccessToken } from "@/lib/github/tokenManager";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

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