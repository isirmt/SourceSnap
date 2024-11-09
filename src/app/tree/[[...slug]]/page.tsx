import { Session } from 'next-auth';
import { auth } from '@/lib/auth';
import SessionButton from '@/components/SessionButton';
import ListPageClient from './page.client';

export default async function ListPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
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

  const [owner, repo, ...pathSegments] = (await params).slug ?? [];
  const path = pathSegments.join('/');

  return (
    <main className='p-4'>
      <ListPageClient defaultTree={{
        owner,
        repo,
        path,
      }} />
      <SessionButton />
    </main>
  );
}
