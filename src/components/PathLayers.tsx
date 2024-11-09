'use client'

import React from "react";

export default function PathLayers({ path, setPathFunc }: { path: string; setPathFunc: (path: string) => void }) {
  const pathLayers = path.split('/').filter(pathLayer => pathLayer !== "")
  pathLayers.unshift("(root)")

  return <div className='flex gap-2 flex-wrap my-2'>
    {pathLayers.map((pathLayer, i) => (
      <React.Fragment key={i}>
        <button
          onClick={() => setPathFunc(pathLayers.slice(1, i + 1).join("/"))}
          className='flex py-0.5 gap-0.5 hover:bg-blue-100'>
          <span className='i-tabler-folder-filled' />
          <span>{pathLayer}</span>
        </button>
        {i < pathLayers.length - 1 && (
          <div className='px-1 bg-gray-100'>
            /
          </div>)}
      </React.Fragment>
    ))}
  </div>
}