'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const octokit = useMemo(() => accessToken ? new Octokit({ auth: accessToken }) : null, [accessToken]);

  type GitHubTreeContent = GetResponseTypeFromEndpointMethod<NonNullable<typeof octokit>['repos']['getContent']>;

  const [owner, setOwner] = useState(defaultTree?.owner ?? "");
  const [repo, setRepo] = useState(defaultTree?.repo ?? "");
  const [path, setPath] = useState(defaultTree?.path ?? "");
  const [contents, setContents] = useState<GitHubTreeContent>();
  const [error, setError] = useState<string | null>(null);

  const getRepoContents = useCallback(async (_owner = owner, _repo = repo, _path = path) => {
    if (!octokit) return;

    try {
      const response = await octokit.repos.getContent({
        owner: _owner,
        repo: _repo,
        path: _path,
      });
      setContents(response);
      setError(null);
    } catch (err) {
      console.error('エラーが発生しました:', err);
      setError('リポジトリの内容を取得できませんでした。');
      setContents(undefined);
    }
  }, [octokit, owner, path, repo]);

  useEffect(() => {
    if (accessToken) {
      getRepoContents();

      const handlePopState = () => {
        const urlParams = new URL(window.location.href);
        const segments = urlParams.pathname.split('/').slice(2);

        const [updatedOwner, updatedRepo, ...pathSegments] = segments;
        const updatedPath = pathSegments.join('/');

        setOwner(updatedOwner || "");
        setRepo(updatedRepo || "");
        setPath(updatedPath || "");
        getRepoContents(updatedOwner, updatedRepo, updatedPath);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [accessToken, getRepoContents]);

  const changePath = (updatedPath = path) => {
    setPath(updatedPath);
    const url = new URL(window.location.origin) + "tree" + `/${owner}/${repo}/${updatedPath}`;
    window.history.pushState({}, "", url);
    getRepoContents(owner, repo, updatedPath);
  };

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
        <button onClick={() => changePath()} className='bg-blue-500 text-white p-2'>
          取得
        </button>
      </div>

      {error && <div className='text-red-500'>{error}</div>}
      <div className='max-w-full w-[40rem]'>
        {contents && Array.isArray(contents.data) && (
          <React.Fragment>
            <PathLayers path={path} setPathFunc={changePath} concatComponent />
            <ul className='w-full border-x border-slate-200 rounded-lg rounded-t-none overflow-clip'>
              {contents.data.filter((item: GitHubReposContext) => item.type === "dir").map((item: GitHubReposContext) => (
                <li key={item.path}>
                  <FolderContext item={item} setPathFunc={changePath} />
                </li>
              ))}
              {contents.data.filter((item: GitHubReposContext) => item.type === "file").map((item: GitHubReposContext) => (
                <li key={item.path}>
                  <FileContext item={item} />
                </li>
              ))}
            </ul>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
