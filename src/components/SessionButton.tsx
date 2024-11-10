import { auth, signIn, signOut } from '@/lib/auth';

export default async function SessionButton() {
  const session = await auth();
  return (
    <>
      {!session && (
        <form
          action={async () => {
            'use server';
            await signIn('GitHub');
          }}
        >
          <button className='my-5 rounded border border-blue-400 bg-transparent px-5 py-2 font-bold text-blue-400 transition-colors hover:bg-blue-100'>
            <span className='i-tabler-brand-github translate-y-1 mr-1' />SignIn
          </button>
        </form>
      )}
      {session && (
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className='my-5 rounded border border-red-400 bg-transparent px-5 py-2 font-bold text-red-400 transition-colors hover:bg-red-100'>
            SignOut
          </button>
        </form>
      )}
    </>
  );
}
