'use client';

import { useCallback, useEffect, useState } from 'react';
import { Octokit } from '@octokit/rest';
import { GetResponseTypeFromEndpointMethod } from '@octokit/types';
import { GitHubReposContext } from '@/types/GitHubReposContext';
import FileContext from './FileContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/github/tokenManager';
import FolderContext from './FolderContext';
import { DefaultTree } from '@/types/GitHubDefaultTree';
import PathLayers from './PathLayers';
import React from 'react';

export default function RepoContentFetcher({ defaultTree }: { defaultTree?: DefaultTree }) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const octokit = new Octokit({
    auth: accessToken,
  });

  type GitHubTreeContent = GetResponseTypeFromEndpointMethod<typeof octokit.repos.getContent>

  const [owner, setOwner] = useState(defaultTree?.owner ?? "");
  const [repo, setRepo] = useState(defaultTree?.repo ?? "");
  const [path, setPath] = useState(defaultTree?.path ?? "");
  const [contents, setContents] = useState<GitHubTreeContent>();
  const [error, setError] = useState<string | null>(null);

  const getRepoContents = useCallback(async (_owner = owner, _repo = repo, _path = path) => {
    try {
      const response = await octokit.repos.getContent({
        owner: _owner,
        repo: _repo,
        path: _path,
      });
      console.log(response.data)
      setContents(response);
      setError(null);
    } catch (err) {
      console.error('エラーが発生しました:', err);
      setError('リポジトリの内容を取得できませんでした。');
      setContents(undefined);
    }
  }, [octokit.repos, owner, path, repo]);

  useEffect(() => {
    getRepoContents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changePath = (updatedPath: string) => {
    setPath(updatedPath)
    getRepoContents(owner, repo, updatedPath)
  }

  return (
    <div className='flex flex-col items-center'>
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
        <button onClick={() => getRepoContents()} className='bg-blue-500 text-white p-2'>
          取得
        </button>
      </div>

      {error && <div className='text-red-500'>{error}</div>}
      <div className='max-w-full w-[40rem]'>
        {contents && (
          <React.Fragment>
            <PathLayers path={path} setPathFunc={changePath} concatComponent />
            <ul className='w-full border-x border-slate-200 rounded-lg rounded-t-none overflow-clip'>
              {Array.isArray(contents.data) &&
                contents.data.map((item: GitHubReposContext) => (
                  <li key={item.path}>
                    {item.type === 'file' ?
                      <FileContext item={item} /> :
                      <FolderContext setPathFunc={changePath} item={item} />}
                  </li>
                ))}
            </ul>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
