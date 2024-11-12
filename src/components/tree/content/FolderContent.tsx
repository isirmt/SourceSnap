'use client';
import { DownloadFolder } from '@/lib/github/downloader';
import { DownloadStatus } from '@/types/DownloadStatus';
import { GitHubReposContext } from '@/types/GitHubReposContext';
import BrowserListItem from './wrapper/BrowserListItem';

interface FolderContentProps {
  item: GitHubReposContext;
  // eslint-disable-next-line no-unused-vars
  setPathFunc: (path: string) => void;
  // eslint-disable-next-line no-unused-vars
  updateFunc: (status: DownloadStatus) => void;
}

export default function FolderContent({ item, setPathFunc, updateFunc: updateStatus }: FolderContentProps) {
  const handleDownload = async () => {
    const { owner, repo } = parseGitHubUrl(item.url);
    DownloadFolder((status) => updateStatus(status), owner, repo, item.path);
  };

  return <BrowserListItem item={item} itemClickFunc={() => setPathFunc(item.path)} downloadFunc={handleDownload} />;
}

function parseGitHubUrl(url: string) {
  const regex = /https:\/\/api\.github\.com\/repos\/([^/]+)\/([^/]+)\/contents\/([^?]+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid GitHub API URL format');
  return { owner: match[1], repo: match[2], path: match[3] };
}
