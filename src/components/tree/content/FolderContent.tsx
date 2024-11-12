'use client';
import { useState } from 'react';
import { DownloadFolder } from '@/lib/github/downloader';
import { parseGitHubApiUrl } from '@/lib/github/urlParser';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const handleDownload = async () => {
    setIsProcessing(true);
    const { owner, repo } = parseGitHubApiUrl(item.url);
    await DownloadFolder((status) => updateStatus(status), owner, repo, item.path);
    setIsProcessing(false);
  };

  return (
    <BrowserListItem
      isDownloading={isProcessing}
      item={item}
      itemClickFunc={() => setPathFunc(item.path)}
      downloadFunc={handleDownload}
    />
  );
}
