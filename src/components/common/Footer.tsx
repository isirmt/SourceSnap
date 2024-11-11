import Link from 'next/link';

export default async function Footer() {
  return (
    <footer className='flex w-full flex-col items-center justify-center border-t border-slate-300 bg-slate-100 py-8 text-center'>
      <div className='mb-4'>
        <Link className='underline' href='/'>
          Top Page
        </Link>
      </div>
      <div className='text-sm'>&copy; isirmt</div>
      <div>
        <Link
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
          href='https://github.com/isirmt/TreeDownloader'
        >
          src on GitHub
        </Link>
      </div>
    </footer>
  );
}
