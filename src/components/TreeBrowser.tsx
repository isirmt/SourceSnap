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
import DistributedInput from './DistributedInput';
import { updateUrl } from '@/lib/tree/urlManager';

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

  const getRepoContents = useCallback(async (_owner = owner, _repo = repo, _path = path, _ref = ref) => {
    if (!octokit || !_owner || !_repo) {
      setContents(undefined);
      return;
    }
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
      console.error('Error Occurred:', err);
      setError('Failed to get contents in repo');
      setContents(undefined);
    }
  }, [owner, repo, path, ref, octokit]);

  useEffect(() => {
    if (accessToken) {
      getRepoContents();

      const handlePopState = () => {
        const urlParams = new URL(window.location.href);
        const segments = urlParams.pathname.split('/').slice(2);
        const updatedRef = urlParams.searchParams.get("ref") ?? undefined;
        const [updatedOwner, updatedRepo, ...pathSegments] = segments;
        const updatedPath = pathSegments.join('/');

        setOwner(updatedOwner);
        setRepo(updatedRepo);
        setPath(updatedPath);
        setRef(updatedRef);

        // Fetch contents only if URL state differs from the current state
        if (updatedOwner !== owner || updatedRepo !== repo || updatedPath !== path || updatedRef !== ref) {
          getRepoContents(updatedOwner, updatedRepo, updatedPath, updatedRef);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [accessToken, owner, repo, path, ref, getRepoContents]);

  const handleUrlUpdate = useCallback((updatedOwner = owner, updatedRepo = repo, updatedPath = path, updatedRef = ref) => {
    setOwner(updatedOwner);
    setRepo(updatedRepo);
    setPath(updatedPath);
    setRef(updatedRef);
    updateUrl(updatedOwner, updatedRepo, updatedPath, updatedRef);
    getRepoContents(updatedOwner, updatedRepo, updatedPath, updatedRef);
  }, [getRepoContents, owner, path, ref, repo]);

  const changePath = (updatedPath = path) => {
    handleUrlUpdate(owner, repo, updatedPath);
  };

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='max-w-full w-[40rem]'>
        <div className='flex border rounded mb-2 hover:border-gray-400 overflow-hidden'>
          <label className='flex items-center justify-center select-none px-2' htmlFor='tree:url'>
            <span className='i-tabler-link' />
          </label>
          <input
            id='tree:url'
            type='text'
            placeholder='Paste GitHub repo/dir URL'
            value={url}
            onChange={(e) => {
              const updatedDir = parseGitHubUrl(e.target.value);
              handleUrlUpdate(updatedDir.owner, updatedDir.repo, updatedDir.path, updatedDir.ref);
              setURL(e.target.value)
            }}
            onPaste={(e) => {
              const updatedDir = parseGitHubUrl(e.clipboardData.getData("text"));
              handleUrlUpdate(updatedDir.owner, updatedDir.repo, updatedDir.path, updatedDir.ref);
            }}
            className='transition-colors p-2 flex-grow outline-none'
          />
        </div>
        <div className='flex w-full items-stretch rounded overflow-hidden'>
          <DistributedInput value={owner} setValue={setOwner} placeholder="Owner" num={5} />
          <DistributedInput value={repo} setValue={setRepo} placeholder="Repo" num={5} />
          <DistributedInput value={path} setValue={setPath} placeholder="Path (Optional)" num={5} />
          <DistributedInput value={ref} setValue={setRef} placeholder="Ref (Optional)" num={5} />
          <button onClick={() => changePath()} className='transition-colors block bg-blue-500 hover:bg-blue-600 text-white w-1/5 py-2'>
            GET
          </button>
        </div>
      </div>

      {!owner || !repo ? (
        <UserRepoList octokit={octokit} onSelectRepo={(_owner: string, _repo: string) => {
          handleUrlUpdate(_owner, _repo);
        }} />
      ) : (
        <>
          {error && <div className='text-red-500'>{error}</div>}
          {Array.isArray(contents?.data) ? <RepoDirList contents={contents.data} path={path} changePath={changePath} /> : null}
        </>
      )}
    </div>
  );
}
