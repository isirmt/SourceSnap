import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex h-full min-h-screen flex-col'>
      <section className='flex flex-col-reverse items-center justify-between gap-y-10 bg-gradient-to-r from-teal-400 to-blue-500 p-10 lg:flex-row'>
        <div className='flex w-full flex-col items-center justify-center gap-4 lg:w-1/2'>
          <div className='pointer-events-none relative aspect-square w-full max-w-96 select-none overflow-hidden rounded-lg shadow-xl'>
            <Image src='/assets/screenshots/dir_list.png' fill alt='dir_list' />
          </div>
        </div>
        <div className='flex w-full flex-col items-center justify-center gap-6 lg:w-1/2'>
          <div className='w-full break-all text-center text-4xl font-bold leading-normal tracking-wider text-white shadow-blue-700 drop-shadow-lg lg:w-4/5 lg:break-normal lg:text-left lg:text-6xl'>
            Download Files/Folders from GitHub
          </div>
          <div className='flex flex-col items-center justify-center gap-3 gap-y-6 lg:flex-row'>
            <Link
              href='/tree'
              className='flex items-center gap-1 rounded-lg bg-zinc-900 p-3 text-xl font-bold text-white shadow-lg shadow-blue-700 transition-colors hover:bg-zinc-800'
            >
              Get Started
              <span className='i-tabler-arrow-right'></span>
            </Link>
            <div className='flex items-center rounded-md bg-slate-50 bg-opacity-60 px-2 py-1'>
              <span className='i-tabler-brand-github-filled mr-0.5' />
              GitHub account required
            </div>
          </div>
        </div>
      </section>
      <section className='flex flex-col items-center bg-gradient-to-b from-emerald-100 to-teal-100 py-5 text-zinc-900'>
        <div className='flex w-[72rem] max-w-full flex-col gap-2 px-4'>
          <div className='text-2xl font-bold'>
            <span className='i-tabler-folder-filled mr-1 translate-y-1' />
            Folder
          </div>
          <div className='text-center text-4xl'>Download folders recursively</div>
          <div className='text-center text-xl'>
            It downloads correctly even if it contains sources, images, or music files.
          </div>
          <div className='mx-auto my-5 flex flex-wrap items-center justify-center gap-8'>
            <div className='flex size-32 items-center justify-center rounded-xl border-8 border-blue-500 text-8xl text-blue-500'>
              <span className='i-tabler-folders' />
            </div>
          </div>
        </div>
      </section>
      <section className='flex flex-grow flex-col items-center bg-zinc-700 py-5 text-zinc-100'>
        <div className='flex w-[72rem] max-w-full flex-col gap-2 px-4'>
          <div className='text-2xl font-bold'>
            <span className='i-tabler-download mr-1 translate-y-1' />
            Status
          </div>
          <div className='text-center text-4xl'>Download status can be checked on the list</div>
          <div className='text-center text-xl'>
            It downloads correctly even if it contains sources, images, or music files.
          </div>
          <div className='mx-auto my-5 flex flex-wrap items-center justify-center gap-8'>
            <div className='flex size-32 items-center justify-center rounded-xl border-8 border-sky-400 text-8xl text-sky-400'>
              <span className='i-tabler-download' />
            </div>
            <div className='flex size-32 items-center justify-center rounded-xl border-8 border-lime-400 text-8xl text-lime-400'>
              <span className='i-tabler-check' />
            </div>
            <div className='flex size-32 items-center justify-center rounded-xl border-8 border-orange-400 text-8xl text-orange-400'>
              <span className='i-tabler-info-triangle-filled' />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
