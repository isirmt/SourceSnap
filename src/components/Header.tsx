/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import SessionButton from "./SessionButton";
import React from "react";

export async function Header() {
  const session: Session | null = await auth();
  return <header className="w-full h-12 bg-slate-100 justify-center flex border-b border-slate-300">
    <div className="max-w-[72rem] px-4 items-stretch w-full h-full flex justify-between">
      <a href="/tree" className="text-xl font-bold text-slate-800 flex items-center">
        Tree Downloader
      </a>

      <div className="group h-auto flex items-stretch relative cursor-pointer">
        <div className="flex gap-1 px-2 items-center text-slate-800 group-hover:bg-slate-200">
          {session ? (
            <React.Fragment>
              <img alt="user-icon" src={session.user.image!} className="size-8 rounded-full" />
              {session.user.id}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="size-8 rounded-full bg-slate-300" />
              Not signed in
            </React.Fragment>)
          }
          <div className="ml-1 size-2 rotate-45 border-r border-b border-slate-400 -translate-y-0.5" />
        </div>
        <div className="hidden cursor-auto group-hover:block absolute top-10 bg-slate-50 border right-0 px-3 rounded shadow">
          <SessionButton />
        </div>
      </div>
    </div>
  </header>
}