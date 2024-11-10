/* eslint-disable @next/next/no-img-element */
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import SessionButton from "./SessionButton";
import React from "react";

export async function Header() {
  const session: Session | null = await auth();
  return <header className="w-full h-12 bg-slate-100 justify-center flex border-b border-slate-300">
    <div className="max-w-[72rem] px-4 items-stretch w-full h-full flex justify-between">
      <div className="text-xl font-bold text-slate-800 flex items-center">
        Tree Downloader
      </div>

      <div className="group h-auto flex items-center">
        <div className="flex gap-1 items-center text-slate-800">
          {session ? (
            <React.Fragment>
              <img alt="user-icon" src={session.user.image!} className="size-8 rounded-full" />
              {session.user.id}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="size-8 rounded-full bg-slate-200" />
              Not signed in
            </React.Fragment>)}
        </div>
        <div className="hidden group-hover:block absolute top-10 bg-slate-50 border right-0 px-3 rounded">
          <SessionButton />
        </div>
      </div>
    </div>
  </header>
}