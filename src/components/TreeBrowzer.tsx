'use client';

import { useState } from 'react';
import { Octokit } from '@octokit/rest';
import { GetResponseTypeFromEndpointMethod } from '@octokit/types';

type RepoContentFetcherProps = {
  accessToken: string;
};

export default function RepoContentFetcher({ accessToken }: RepoContentFetcherProps) {
  const octokit = new Octokit({
    auth: accessToken,
  });

  type GitHubTreeContent = GetResponseTypeFromEndpointMethod<typeof octokit.repos.getContent>

  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [path, setPath] = useState('');
  const [contents, setContents] = useState<GitHubTreeContent>();
  const [error, setError] = useState<string | null>(null);

  const getRepoContents = async () => {
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      console.log(response.data)
      setContents(response);
      setError(null);
    } catch (err) {
      console.error('エラーが発生しました:', err);
      setError('リポジトリの内容を取得できませんでした。');
      setContents(undefined);
    }
  };

  return (
    <div>
      <h2>リポジトリの内容を取得</h2>
      <div>
        <input
          type='text'
          placeholder='オーナー'
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className='border p-2 mb-2'
        />
        <input
          type='text'
          placeholder='リポジトリ名'
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          className='border p-2 mb-2'
        />
        <input
          type='text'
          placeholder='パス (任意)'
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className='border p-2 mb-2'
        />
        <button onClick={getRepoContents} className='bg-blue-500 text-white p-2'>
          取得
        </button>
      </div>

      {error && <div className='text-red-500'>{error}</div>}

      {contents && (
        <ul>
          {Array.isArray(contents.data) &&
            contents.data.map((item) => (
              <li key={item.path}>
                {item.type === 'file' ? '📄' : '📁'} {item.path}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
