import React, { useEffect, useState } from 'react';
import { Octokit } from '@octokit/rest';
import { GetResponseTypeFromEndpointMethod } from '@octokit/types';
import RepoContext from './RepoContext';

interface RepoListProps {
  octokit: Octokit | null;
  onSelectRepo: (owner: string, repo: string) => void;
}

export default function UserRepoList({ octokit, onSelectRepo }: RepoListProps) {
  type GitHubUserRepos = GetResponseTypeFromEndpointMethod<NonNullable<typeof octokit>['repos']['listForAuthenticatedUser']>;
  type GitHubUserStarredRepos = GetResponseTypeFromEndpointMethod<NonNullable<typeof octokit>['activity']['listReposStarredByAuthenticatedUser']>;

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
          const userReposResponse = await octokit.repos.listForAuthenticatedUser({ per_page: 30, page: _userPage });
          const starredReposResponse = await octokit.activity.listReposStarredByAuthenticatedUser({ per_page: 30, page: _starredPage });

          setUserRepos((prevRepos) => [...prevRepos, ...userReposResponse.data]);
          setStarredRepos((prevRepos) => [...prevRepos, ...starredReposResponse.data]);
        } catch (err) {
          console.error('Failed to get repos:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRepos(userPage, starredPage);
  }, [octokit, userPage, starredPage]);

  const loadMoreUserRepos = () => setUserPage((prevPage) => prevPage + 1);
  const loadMoreStarredRepos = () => setStarredPage((prevPage) => prevPage + 1);

  return (
    <div className='max-w-full w-[40rem]'>
      <h2 className='font-bold'>Your Repositories</h2>
      <ul className='block w-full border-x border-slate-200 rounded-lg overflow-clip'>
        {userRepos.map((repo) => (
          <li key={`user:${repo.id}`}>
            <RepoContext
              owner={repo.owner.login}
              repo={repo.name}
              onSelectRepo={() => onSelectRepo(repo.owner.login, repo.name)}
            />
          </li>
        ))}
      </ul>
      <button onClick={loadMoreUserRepos} disabled={loading} className="p-2 bg-blue-500 text-white disabled:bg-gray-400 disabled:text-gray-700 rounded my-2 hover:bg-blue-600 transition-colors">
        {loading ? 'Loading...' : 'Load More'}
      </button>
      <h2 className='font-bold'>Your Starred Repositories</h2>
      <ul className='block w-full border-x border-slate-200 rounded-lg overflow-clip'>
        {starredRepos.map((repo) => (
          <li key={`star:${repo.id}`}>
            <RepoContext
              owner={repo.owner.login}
              repo={repo.name}
              onSelectRepo={() => onSelectRepo(repo.owner.login, repo.name)}
            />
          </li>
        ))}
      </ul>
      <button onClick={loadMoreStarredRepos} disabled={loading} className="p-2 bg-blue-500 text-white disabled:bg-gray-400 disabled:text-gray-700 rounded my-2 hover:bg-blue-600 transition-colors">
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}
