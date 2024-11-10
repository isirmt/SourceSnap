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

  const [userRepos, setUserRepos] = useState<GitHubUserRepos>();
  const [starredRepos, setStarredRepos] = useState<GitHubUserStarredRepos>();

  useEffect(() => {
    if (octokit) {
      const fetchRepos = async () => {
        try {
          const userReposResponse = await octokit.repos.listForAuthenticatedUser();
          const starredReposResponse = await octokit.activity.listReposStarredByAuthenticatedUser();
          setUserRepos(userReposResponse);
          setStarredRepos(starredReposResponse);
        } catch (err) {
          console.error('リポジトリの取得に失敗しました:', err);
        }
      };
      fetchRepos();
    }
  }, [octokit]);

  return (
    <div>
      <h2 className='font-bold'>候補のリポジトリ一覧</h2>
      <div className='max-w-full w-[40rem]'>
        <ul className='w-full border-x border-slate-200 rounded-lg rounded-t-none overflow-clip'>
          {userRepos?.data.map((repo) => (
            <li key={repo.id}>
              <RepoContext
                owner={repo.owner.login}
                repo={repo.name}
                onSelectRepo={() => onSelectRepo(repo.owner.login, repo.name)}
              />
            </li>
          ))}
          {starredRepos?.data.map((repo) => (
            <li key={repo.id}>
              <RepoContext
                owner={repo.owner.login}
                repo={repo.name}
                onSelectRepo={() => onSelectRepo(repo.owner.login, repo.name)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
