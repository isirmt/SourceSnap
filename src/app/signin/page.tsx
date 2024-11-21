import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Provider } from 'next-auth/providers';
import SignInButton from '@/components/signin/SigninButton';
import { auth } from '@/lib/auth';

export type AuthProvider = Partial<Provider> & {
  id: string;
  name: string;
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const session = await auth();
  const callbackUrl = (await searchParams)['callbackUrl'];

  if (session) {
    redirect(callbackUrl !== '' ? decodeURIComponent(callbackUrl) : '/tree');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/providers`);
  const providers: Record<string, AuthProvider> = await res.json();

  return (
    <main className='flex h-full min-h-screen flex-col'>
      <section className='flex flex-grow flex-col-reverse items-stretch lg:flex-row'>
        <div className='flex w-full flex-grow items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 p-10 lg:w-1/2 lg:flex-grow-0'>
          <div className='text-6xl font-bold leading-tight text-white drop-shadow-xl lg:text-9xl'>
            Let&apos;s get started
          </div>
        </div>
        <div className='flex w-full flex-col items-center justify-center gap-10 p-10 lg:w-1/2'>
          <div className='flex gap-2 text-3xl font-bold'>
            <span className='relative inline-block size-8'>
              <Image src='/icon.png' fill alt='logo' />
            </span>
            <span>SourceSnap</span>
          </div>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <SignInButton provider={provider} />
            </div>
          ))}
          <div className='text-sm text-gray-800'>
            Please click this button even if you are logging in for the first time
          </div>
        </div>
      </section>
    </main>
  );
}
