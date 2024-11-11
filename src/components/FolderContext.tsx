'use client';
import saveAs from 'file-saver';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/github/tokenManager';
import { DownloadStatus } from '@/types/DownloadStatus';
import { GitHubReposContext } from '@/types/GitHubReposContext';
import BrowserListItem from './BrowserListItem';

interface FolderContextProps {
  item: GitHubReposContext;
  // eslint-disable-next-line no-unused-vars
  setPathFunc: (path: string) => void;
  // eslint-disable-next-line no-unused-vars
  updateFunc: (status: DownloadStatus) => void;
}

export default function FolderContext({ item, setPathFunc, updateFunc: updateStatus }: FolderContextProps) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleDownload = async () => {
    const { owner, repo } = parseGitHubUrl(item.url);
    updateStatus('downloading');
    if (!accessToken) {
      alert('No access token is set');
      return;
    }
    try {
      const response = await fetch(
        `/api/get-folder?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&path=${item.path}`,
      );
      if (!response.ok) {
        throw new Error('Failed to download folder');
      }
      const blob = await response.blob();
      saveAs(blob, item.name);
      updateStatus('completed');
    } catch (error) {
      console.error('Failed to download folder:', error);
      updateStatus('error');
    }
  };

  return <BrowserListItem item={item} itemClickFunc={() => setPathFunc(item.path)} downloadFunc={handleDownload} />;
}

function parseGitHubUrl(url: string) {
  const regex = /https:\/\/api\.github\.com\/repos\/([^/]+)\/([^/]+)\/contents\/([^?]+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid GitHub API URL format');
  return { owner: match[1], repo: match[2], path: match[3] };
}
