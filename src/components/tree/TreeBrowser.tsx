'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { Octokit } from '@octokit/rest';
import { GetResponseTypeFromEndpointMethod } from '@octokit/types';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/github/tokenManager';
import { parseGitHubRepoUrl } from '@/lib/github/urlParser';
import { updateUrl } from '@/lib/tree/urlManager';
import { DefaultTree } from '@/types/GitHubDefaultTree';
import DistributedInput from '../common/fragment/DistributedInput';
import RepoDirList from './RepoDirList';
import TreeSection from './TreeSection';
import UserRepoList from './UserRepoList';

export default function RepoContentFetcher({ defaultTree }: { defaultTree?: DefaultTree }) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const octokit = useMemo(() => (accessToken ? new Octokit({ auth: accessToken }) : null), [accessToken]);

  type GitHubTreeContent = GetResponseTypeFromEndpointMethod<NonNullable<typeof octokit>['repos']['getContent']>;

  const [url, setURL] = useState('');
  const [owner, setOwner] = useState(defaultTree?.owner ?? '');
  const [repo, setRepo] = useState(defaultTree?.repo ?? '');
  const [path, setPath] = useState(defaultTree?.path ?? '');
  const [ref, setRef] = useState(defaultTree?.ref);
  const [contents, setContents] = useState<GitHubTreeContent>();
  const [error, setError] = useState<string | null>(null);

  const getRepoContents = useCallback(
    async (_owner = owner, _repo = repo, _path = path, _ref = ref) => {
      if (!octokit || !_owner || !_repo) {
        setContents(undefined);
        return;
      }
      try {
        const response = await octokit.repos.getContent({
          owner: _owner,
          repo: _repo,
          path: _path,
          ref: _ref?.trim() !== '' ? _ref : undefined,
        });
        setContents(response);
        setError(null);
      } catch (err) {
        console.error('Error Occurred:', err);
        setError('Failed to get contents in repo');
        setContents(undefined);
      }
    },
    [owner, repo, path, ref, octokit],
  );

  useEffect(() => {
    if (accessToken) {
      getRepoContents();

      const handlePopState = () => {
        const urlParams = new URL(window.location.href);
        const segments = urlParams.pathname.split('/').slice(2);
        const updatedRef = urlParams.searchParams.get('ref') ?? undefined;
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

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [accessToken, owner, repo, path, ref, getRepoContents]);

  const handleUrlUpdate = useCallback(
    (updatedOwner = owner, updatedRepo = repo, updatedPath = path, updatedRef = ref) => {
      setOwner(updatedOwner);
      setRepo(updatedRepo);
      setPath(updatedPath);
      setRef(updatedRef);
      updateUrl(updatedOwner, updatedRepo, updatedPath, updatedRef);
      getRepoContents(updatedOwner, updatedRepo, updatedPath, updatedRef);
    },
    [getRepoContents, owner, path, ref, repo],
  );

  const changePath = (updatedPath = path) => {
    handleUrlUpdate(owner, repo, updatedPath);
  };

  return (
    <TreeSection>
      <div className='mb-2 flex overflow-hidden rounded border hover:border-gray-400'>
        <label className='flex select-none items-center justify-center px-2' htmlFor='tree:url'>
          <span className='i-tabler-link' />
        </label>
        <input
          id='tree:url'
          type='text'
          placeholder='Paste GitHub repo/dir URL'
          value={url}
          onChange={(e) => {
            setURL(e.target.value);
            const updatedDir = parseGitHubRepoUrl(e.target.value);
            handleUrlUpdate(updatedDir.owner, updatedDir.repo, updatedDir.path, updatedDir.ref);
          }}
          onPaste={(e) => {
            const updatedDir = parseGitHubRepoUrl(e.clipboardData.getData('text'));
            handleUrlUpdate(updatedDir.owner, updatedDir.repo, updatedDir.path, updatedDir.ref);
          }}
          className='flex-grow p-2 outline-none transition-colors'
        />
      </div>
      <div className='flex w-full items-stretch overflow-hidden rounded'>
        <DistributedInput
          value={owner}
          setValue={setOwner}
          onChange={(val) => handleUrlUpdate(val, repo, path, ref)}
          placeholder='Owner'
          num={5}
        />
        <DistributedInput
          value={repo}
          setValue={setRepo}
          onChange={(val) => handleUrlUpdate(owner, val, path, ref)}
          placeholder='Repo'
          num={5}
        />
        <DistributedInput
          value={path}
          setValue={setPath}
          onChange={(val) => handleUrlUpdate(owner, repo, val, ref)}
          placeholder='Path (Optional)'
          num={5}
        />
        <DistributedInput
          value={ref}
          setValue={setRef}
          onChange={(val) => handleUrlUpdate(owner, repo, path, val)}
          placeholder='Ref (Optional)'
          num={5}
        />
        <button
          onClick={() => changePath()}
          className='block w-1/5 bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600'
        >
          GET
        </button>
      </div>

      {!owner || !repo ? (
        <UserRepoList
          octokit={octokit}
          onSelectRepo={(_owner: string, _repo: string) => {
            handleUrlUpdate(_owner, _repo);
          }}
        />
      ) : (
        <>
          {error && <div className='text-red-500'>{error}</div>}
          {Array.isArray(contents?.data) ? (
            <React.Fragment>
              <h1 className='block w-[40rem] max-w-full p-2'>
                <Link
                  target='_blank'
                  rel='noopener noreferrer'
                  title='Open with GitHub'
                  href={`https://github.com/${owner}/${repo}`}
                  className='inline-flex justify-start gap-1 text-xl underline'
                >
                  <span className='i-tabler-brand-github-filled translate-y-1.5' />
                  <span>
                    {owner}/{repo}
                  </span>
                </Link>
              </h1>
              <RepoDirList contents={contents.data} owner={owner} repo={repo} path={path} changePath={changePath} />
            </React.Fragment>
          ) : null}
        </>
      )}
    </TreeSection>
  );
}
