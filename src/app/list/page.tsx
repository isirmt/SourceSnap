import { Session } from 'next-auth';
import { auth } from '@/lib/auth';
import SessionButton from '@/components/SessionButton';
import RepoContentFetcher from '@/components/TreeBrowzer';

export default async function Dashboard() {
  const session: Session | null = await auth();
  if (!session) {
    return (
      <main className='p-4'>
        <div>ログインが必要</div>
        <SessionButton />
      </main>
    );
  }

  const accessToken = session.access_token;

  if (!accessToken) {
    return (
      <main className='p-4'>
        <div>アクセストークンが取得できませんでした。</div>
        <SessionButton />
      </main>
    );
  }

  return (
    <main className='p-4'>
      <div>ユーザー情報</div>
      <div>ID: {session.user?.id}</div>
      {/* <div>アクセストークン: {session.access_token}</div> */}

      <RepoContentFetcher accessToken={accessToken} />

      <SessionButton />
    </main>
  );
}
