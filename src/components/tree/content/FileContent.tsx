'use client';
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
  const handleDownload = async () => {
    DownloadFile((status) => updateStatus(status), item.download_url, item.name);
  };

  return (
    <BrowserListItem
      item={item}
      itemClickFunc={() => window.open(item.html_url!, '_blank', 'noopener,noreferrer')}
      downloadFunc={handleDownload}
    />
  );
}
