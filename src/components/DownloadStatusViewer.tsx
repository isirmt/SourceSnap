'use client';

import { useState } from "react";
import { ArrowDownBlock, ArrowUpBlock } from "./ArrowBlock";
import React from "react";

export default function DownloadStatusViewer({ status, deleteFunc }: { status: { name: string, status: "downloading" | "completed" | "error" }[]; deleteFunc: (name: string) => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const downloadedCount = status.filter((item) => item.status === "completed").length
  const errorCount = status.filter((item) => item.status === "error").length

  return <div className={`select-none sticky flex flex-col bottom-0 mt-2 border rounded-t-lg overflow-clip max-h-[50svh] bg-white ${isOpen && "shadow"}`}>
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="transition-colors w-full bg-gray-100 hover:bg-gray-200 p-2 flex items-center justify-center gap-1"
    >
      Status: <span className={`${errorCount > 0 && "text-red-700"}`}>({downloadedCount}/{status.length} completed)</span>
      {isOpen ? <ArrowDownBlock /> : <ArrowUpBlock />}
    </button>
    {isOpen && <div className="flex-grow overflow-y-auto p-2 flex flex-col">
      {status.length > 0 ?
        status.map((item) => (
          <div key={item.name} className="p-1.5 border-b flex items-stretch justify-between">
            <div className="text-sm flex gap-1 items-center">
              <span className={`${item.status === 'completed' ? 'i-tabler-check bg-lime-700' : item.status === 'downloading' ? "i-tabler-download bg-sky-700" : "i-tabler-info-triangle-filled bg-orange-700"}`}></span>
              <span>{item.name}</span>
            </div>
            <div className="flex items-center">
              <button onClick={() => deleteFunc(item.name)} title="clear log" type="button" className="flex items-center justify-center p-0.5 group">
                <span className="i-tabler-trash bg-gray-500 hover:bg-red-700" />
              </button>
            </div>
          </div>
        )) :
        <div className="text-center">
          No downloads
        </div>}
    </div>}
  </div>
}