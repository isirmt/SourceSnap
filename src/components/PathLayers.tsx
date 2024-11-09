'use client'

import React from "react";

export default function PathLayers({ path, setPathFunc, concatComponent }: { path: string; setPathFunc: (path: string) => void, concatComponent?: boolean }) {
  const pathLayers = path.split('/').filter(pathLayer => pathLayer !== "")
  pathLayers.unshift("(root)")

  return <div className={`flex gap-2 flex-wrap bg-gray-50 p-2 rounded-lg ${concatComponent ? "border-x border-t rounded-b-none" : "my-2"}`}>
    {pathLayers.map((pathLayer, i) => (
      <React.Fragment key={i}>
        <button
          disabled={i == pathLayers.length - 1}
          onClick={() => setPathFunc(pathLayers.slice(1, i + 1).join("/"))}
          className={`${i != pathLayers.length - 1 ? "underline" : "font-bold"} bg-transparent flex py-0.5 gap-0.5 disabled:pointer-events-none hover:bg-slate-200 px-1.5 rounded-sm`}
        >
          <span className='i-tabler-folder-filled translate-y-1.5' />
          <span>{pathLayer}</span>
        </button>
        {i < pathLayers.length - 1 && (
          <div className='text-xl select-none text-gray-300'>
            /
          </div>)}
      </React.Fragment>
    ))}
  </div>
}