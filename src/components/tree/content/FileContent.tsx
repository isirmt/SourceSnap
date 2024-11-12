'use client';
import { useState } from 'react';
import { DownloadFile } from '@/lib/github/downloader';
import { DownloadStatus } from '@/types/DownloadStatus';
import { GitHubReposContext } from '@/types/GitHubReposContext';
import BrowserListItem from './wrapper/BrowserListItem';

interface FileContentProps {
  item: GitHubReposContext;
  // eslint-disable-next-line no-unused-vars
  updateFunc: (status: DownloadStatus) => void;
}

export default function FileContent({ item, updateFunc: updateStatus }: FileContentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const handleDownload = async () => {
    setIsProcessing(true);
    await DownloadFile((status) => updateStatus(status), item.download_url, item.name);
    setIsProcessing(false);
  };

  return (
    <BrowserListItem
      isDownloading={isProcessing}
      item={item}
      itemClickFunc={() => window.open(item.html_url!, '_blank', 'noopener,noreferrer')}
      downloadFunc={handleDownload}
    />
  );
}
