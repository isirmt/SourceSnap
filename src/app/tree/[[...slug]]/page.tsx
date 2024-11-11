import { Session } from 'next-auth';
import SessionButton from '@/components/SessionButton';
import { auth } from '@/lib/auth';
import ListPageClient from './page.client';

export default async function ListPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const session: Session | null = await auth();
  if (!session) {
    return (
      <main className='p-4'>
        <div>Need to login</div>
        <SessionButton />
      </main>
    );
  }

  const accessToken = session.access_token;

  if (!accessToken) {
    return (
      <main className='p-4'>
        <div>Failed to get access token</div>
        <SessionButton />
      </main>
    );
  }

  const [owner, repo, ...pathSegments] = (await params).slug ?? [];
  const path = pathSegments.join('/');

  const ref = (await searchParams)['ref'];

  return (
    <main className='p-4'>
      <ListPageClient
        defaultTree={{
          owner,
          repo,
          path,
          ref: ref !== '' ? ref : undefined,
        }}
      />
    </main>
  );
}
