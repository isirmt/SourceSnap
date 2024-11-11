'use client';

import { useState } from 'react';
import React from 'react';
import { ArrowDownBlock, ArrowUpBlock } from '@/components/common/fragment/ArrowBlock';

export default function DownloadStatusViewer({
  status,
  deleteFunc,
}: {
  status: { name: string; status: 'downloading' | 'completed' | 'error' }[];
  // eslint-disable-next-line no-unused-vars
  deleteFunc: (name: string) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const downloadedCount = status.filter((item) => item.status === 'completed').length;
  const errorCount = status.filter((item) => item.status === 'error').length;

  return (
    <div
      className={`sticky bottom-0 mt-2 flex max-h-[50svh] select-none flex-col overflow-clip rounded-t-lg border bg-white ${isOpen && 'shadow'}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-center gap-1 bg-gray-100 p-2 transition-colors hover:bg-gray-200'
      >
        Status:{' '}
        <span className={`${errorCount > 0 && 'text-red-700'}`}>
          ({downloadedCount}/{status.length} completed)
        </span>
        {isOpen ? <ArrowDownBlock /> : <ArrowUpBlock />}
      </button>
      {isOpen && (
        <div className='flex flex-grow flex-col overflow-y-auto p-2'>
          {status.length > 0 ? (
            status.map((item) => (
              <div key={item.name} className='flex items-stretch justify-between border-b p-1.5'>
                <div className='flex items-center gap-1 text-sm'>
                  <span
                    className={`${item.status === 'completed' ? 'i-tabler-check bg-lime-700' : item.status === 'downloading' ? 'i-tabler-download bg-sky-700' : 'i-tabler-info-triangle-filled bg-orange-700'}`}
                  ></span>
                  <span>{item.name}</span>
                </div>
                <div className='flex items-center'>
                  <button
                    onClick={() => deleteFunc(item.name)}
                    title='clear log'
                    type='button'
                    className='group flex items-center justify-center p-0.5'
                  >
                    <span className='i-tabler-trash bg-gray-500 hover:bg-red-700' />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center'>No downloads</div>
          )}
        </div>
      )}
    </div>
  );
}
