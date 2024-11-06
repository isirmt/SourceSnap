import { Session } from 'next-auth';
import { auth } from '@/lib/auth';
import SessionButton from '@/components/SessionButton';
import { Octokit } from '@octokit/rest';

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

  const octokit = new Octokit({
    auth: accessToken,
  });

  try {
    const getRepoContents = async (owner: string, repo: string, path: string = '') => {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      return response.data;
    };

    const contents = await getRepoContents('USER', 'REPO', "DIR");

    console.log(contents);

    return (
      <main className='p-4'>
        <div>ユーザー情報</div>
        <div>ID: {session.user?.id}</div>
        <div>アクセストークン: {session.access_token}</div>
        <h2>リポジトリの内容</h2>
        <ul>
          {Array.isArray(contents) &&
            contents.map((item) => (
              <li key={item.path}>
                {item.type === 'file' ? '📄' : '📁'} {item.path}
              </li>
            ))}
        </ul>
        <SessionButton />
      </main>
    );
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return (
      <main className='p-4'>
        <div>ユーザー情報</div>
        <div>ID: {session.user?.id}</div>
        <div>アクセストークン: {session.access_token}</div>
        <div>リポジトリの内容を取得できませんでした。</div>
        <SessionButton />
      </main>
    );
  }
}
