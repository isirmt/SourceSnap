'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Octokit } from '@octokit/rest';
import { GetResponseTypeFromEndpointMethod } from '@octokit/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/github/tokenManager';
import { DefaultTree } from '@/types/GitHubDefaultTree';
import React from 'react';
import { parseGitHubUrl } from '@/lib/github/urlParser';
import UserRepoList from './UserRepoList';
import RepoDirList from './RepoDirList';

export default function RepoContentFetcher({ defaultTree }: { defaultTree?: DefaultTree }) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const octokit = useMemo(() => accessToken ? new Octokit({ auth: accessToken }) : null, [accessToken]);

  type GitHubTreeContent = GetResponseTypeFromEndpointMethod<NonNullable<typeof octokit>['repos']['getContent']>;

  const [url, setURL] = useState("");
  const [owner, setOwner] = useState(defaultTree?.owner ?? "");
  const [repo, setRepo] = useState(defaultTree?.repo ?? "");
  const [path, setPath] = useState(defaultTree?.path ?? "");
  const [ref, setRef] = useState(defaultTree?.ref);
  const [contents, setContents] = useState<GitHubTreeContent>();
  const [error, setError] = useState<string | null>(null);

  const updateURL = useCallback((_owner = owner, _repo = repo, _path = path, _ref = ref) => {
    if (!_owner || !_repo) return;
    const url = new URL(window.location.origin) + "tree" + `/${_owner}/${_repo}/${_path}${_ref ? `?ref=${_ref}` : ""}`;
    window.history.pushState({}, "", url);
  }, [owner, path, ref, repo])

  const getRepoContents = useCallback(async (_owner = owner, _repo = repo, _path = path, _ref = ref) => {
    if (!octokit || !_owner || !_repo) return;
    try {
      const response = await octokit.repos.getContent({
        owner: _owner,
        repo: _repo,
        path: _path,
        ref: _ref?.trim() !== "" ? _ref : undefined,
      });
      setContents(response);
      setError(null);
    } catch (err) {
      console.error('エラーが発生しました:', err);
      setError('リポジトリの内容を取得できませんでした。');
      setContents(undefined);
    }
  }, [owner, repo, path, ref, octokit]);

  useEffect(() => {
    if (accessToken) {
      updateURL()
      getRepoContents();

      const handlePopState = () => {
        const urlParams = new URL(window.location.href);
        const segments = urlParams.pathname.split('/').slice(2);
        const updatedRef = urlParams.searchParams.get("ref") ?? undefined;

        const [updatedOwner, updatedRepo, ...pathSegments] = segments;
        const updatedPath = pathSegments.join('/');

        setOwner(updatedOwner || "");
        setRepo(updatedRepo || "");
        setPath(updatedPath || "");
        setRef(updatedRef);
        getRepoContents(updatedOwner, updatedRepo, updatedPath);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [accessToken, getRepoContents, updateURL]);

  const changePath = (updatedPath = path) => {
    setPath(updatedPath);
    getRepoContents(owner, repo, updatedPath, ref)
  };

  return (
    <div className='flex flex-col items-center'>
      <div>
        <input
          type='text'
          placeholder='URL'
          value={url}
          onChange={(e) => setURL(e.target.value)}
          onPaste={(e) => {
            const updatedDir = parseGitHubUrl(e.clipboardData.getData("text"))
            setOwner(updatedDir.owner);
            setRepo(updatedDir.repo)
            setPath(updatedDir.path)
            setRef(updatedDir.ref)
            getRepoContents(updatedDir.owner, updatedDir.repo, updatedDir.path, updatedDir.ref)
          }}
          className='border p-2 mb-2 block'
        />
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
        <input
          type='text'
          placeholder='Ref (任意)'
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          className='border p-2 mb-2'
        />
        <button onClick={() => changePath()} className='bg-blue-500 text-white p-2'>
          取得
        </button>
      </div>

      {!owner && !repo ?
        <UserRepoList octokit={octokit} onSelectRepo={(_owner: string, _repo: string) => {
          setOwner(_owner)
          setRepo(_repo)
          getRepoContents(_owner, _repo, path, ref)
        }} /> :
        <React.Fragment>
          {error && <div className='text-red-500'>{error}</div>}
          {Array.isArray(contents?.data) ? <RepoDirList contents={contents.data} path={path} changePath={changePath} /> : <></>}
        </React.Fragment>}
    </div>
  );
}
