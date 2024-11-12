import React from 'react';

export default function TreeSection({ children, width = '40rem' }: { children?: React.ReactNode; width?: string }) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <div className={`w-[${width}] max-w-full`}>{children}</div>
    </div>
  );
}
