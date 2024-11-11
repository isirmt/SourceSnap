'use client';

import React from 'react';

export default function PathLayers({
  path,
  setPathFunc,
  concatComponent,
}: {
  path: string;
  // eslint-disable-next-line no-unused-vars
  setPathFunc: (path: string) => void;
  concatComponent?: boolean;
}) {
  const pathLayers = path.split('/').filter((pathLayer) => pathLayer !== '');
  pathLayers.unshift('(root)');

  return (
    <div
      className={`flex flex-wrap gap-2 rounded-lg bg-gray-50 p-2 ${concatComponent ? 'rounded-b-none border-x border-t' : 'my-2'}`}
    >
      {pathLayers.map((pathLayer, i) => (
        <React.Fragment key={i}>
          <button
            disabled={i == pathLayers.length - 1}
            onClick={() => setPathFunc(pathLayers.slice(1, i + 1).join('/'))}
            className={`${i != pathLayers.length - 1 ? 'underline' : 'font-bold'} flex gap-0.5 rounded-sm bg-transparent px-1.5 py-0.5 hover:bg-slate-200 disabled:pointer-events-none`}
          >
            <span className='i-tabler-folder-filled translate-y-1.5' />
            <span>{pathLayer}</span>
          </button>
          {i < pathLayers.length - 1 && <div className='select-none text-xl text-gray-300'>/</div>}
        </React.Fragment>
      ))}
    </div>
  );
}
