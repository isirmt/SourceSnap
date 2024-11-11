import React, { useEffect, useState } from 'react';
import { Octokit } from '@octokit/rest';
import { GetResponseTypeFromEndpointMethod } from '@octokit/types';
import RepoContent from './content/RepoContent';

interface RepoListProps {
  octokit: Octokit | null;
  // eslint-disable-next-line no-unused-vars
  onSelectRepo: (owner: string, repo: string) => void;
}

export default function UserRepoList({ octokit, onSelectRepo }: RepoListProps) {
  type GitHubUserRepos = GetResponseTypeFromEndpointMethod<
    NonNullable<typeof octokit>['repos']['listForAuthenticatedUser']
  >;
  type GitHubUserStarredRepos = GetResponseTypeFromEndpointMethod<
    NonNullable<typeof octokit>['activity']['listReposStarredByAuthenticatedUser']
  >;

  const [userRepos, setUserRepos] = useState<GitHubUserRepos['data']>([]);
  const [starredRepos, setStarredRepos] = useState<GitHubUserStarredRepos['data']>([]);
  const [userPage, setUserPage] = useState(1);
  const [starredPage, setStarredPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRepos = async (_userPage = userPage, _starredPage = starredPage) => {
      if (octokit) {
        try {
          setLoading(true);
          const userRepoIds = new Set(userRepos.map((repo) => repo.id));
          const starredRepoIds = new Set(starredRepos.map((repo) => repo.id));

          const userReposResponse = await octokit.repos.listForAuthenticatedUser({ per_page: 30, page: _userPage });
          const starredReposResponse = await octokit.activity.listReposStarredByAuthenticatedUser({
            per_page: 30,
            page: _starredPage,
          });

          const newUserRepos = userReposResponse.data.filter((repo) => !userRepoIds.has(repo.id));
          const newStarredRepos = starredReposResponse.data.filter((repo) => !starredRepoIds.has(repo.id));

          setUserRepos((prevRepos) => [...prevRepos, ...newUserRepos]);
          setStarredRepos((prevRepos) => [...prevRepos, ...newStarredRepos]);
        } catch (err) {
          console.error('Failed to get repos:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRepos(userPage, starredPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [octokit, userPage, starredPage]);

  const loadMoreUserRepos = () => setUserPage((prevPage) => prevPage + 1);
  const loadMoreStarredRepos = () => setStarredPage((prevPage) => prevPage + 1);

  return (
    <div className='w-[40rem] max-w-full'>
      <h2 className='font-bold'>Your Repositories</h2>
      <ul className='block w-full overflow-clip rounded-lg border-x border-slate-200'>
        {userRepos.map((repo) => (
          <li key={`user:${repo.id}`}>
            <RepoContent
              owner={repo.owner.login}
              repo={repo.name}
              onSelectRepo={() => onSelectRepo(repo.owner.login, repo.name)}
            />
          </li>
        ))}
      </ul>
      <BlueLoadButton onClick={loadMoreUserRepos} isLoading={loading} />
      <h2 className='font-bold'>Your Starred Repositories</h2>
      <ul className='block w-full overflow-clip rounded-lg border-x border-slate-200'>
        {starredRepos.map((repo) => (
          <li key={`star:${repo.id}`}>
            <RepoContent
              owner={repo.owner.login}
              repo={repo.name}
              onSelectRepo={() => onSelectRepo(repo.owner.login, repo.name)}
            />
          </li>
        ))}
      </ul>
      <BlueLoadButton onClick={loadMoreStarredRepos} isLoading={loading} />
    </div>
  );
}

function BlueLoadButton({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className='mx-auto my-2 block rounded border border-blue-500 bg-transparent p-2 font-bold text-blue-500 transition-colors hover:bg-blue-500 hover:text-white disabled:border-gray-400 disabled:bg-gray-400 disabled:text-gray-700'
    >
      {isLoading ? 'Loading...' : 'Load More'}
    </button>
  );
}
