import { Session } from 'next-auth';
import { auth } from '@/lib/auth';
import SessionButton from '@/components/SessionButton';


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

  console.log(session)

  return (
    <main className='p-4'>
      <div>ユーザー情報</div>
      <div>{session.user?.id}</div>
      <div>{session.access_token}</div>
      <SessionButton />
    </main>
  );


}