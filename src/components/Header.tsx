/* eslint-disable @next/next/no-img-element */
import { auth } from "@/lib/auth";
import { Session } from "next-auth";

export async function Header() {
  const session: Session | null = await auth();
  return <header className="w-full h-12 bg-slate-100 justify-center flex border-b border-slate-300">
    <div className="max-w-[72rem] px-4 items-center w-full h-full flex justify-between">
      <div className="text-xl font-bold text-slate-800">
        Tree Downloader
      </div>
      {session ? (
        <div className="flex gap-1 items-center text-slate-800">
          <img alt="user-icon" src={session.user.image!} className="size-8 rounded-full" />
          {session.user.id}
        </div>) : <div></div>}
    </div>
  </header>
}