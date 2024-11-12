import React, { useState } from 'react';
import { DownloadFolder } from '@/lib/github/downloader';
import { DownloadStatus, DownloadStatusData } from '@/types/DownloadStatus';
import { GitHubReposContext } from '@/types/GitHubReposContext';
import FileContent from './content/FileContent';
import FolderContent from './content/FolderContent';
import BrowserListItem from './content/wrapper/BrowserListItem';
import DownloadStatusViewer from './fragment/DownloadStatusViewer';
import PathLayers from './fragment/PathLayers';

interface RepoContentsProps {
  contents: GitHubReposContext[] | undefined;
  owner: string;
  repo: string;
  path: string;
  // eslint-disable-next-line no-unused-vars
  changePath: (updatedPath: string) => void;
}

export default function RepoDirList({ contents, owner, repo, path, changePath }: RepoContentsProps) {
  const [status, setStatus] = useState<DownloadStatusData[]>([]);

  const handleDownload = async () => {
    DownloadFolder((status: DownloadStatus) => updateStatus(path, status), owner, repo, path);
  };

  const updateStatus = (path: string, newStatus: DownloadStatus) => {
    const itemName = `${owner}/${repo}: ${path}`;
    setStatus((prevStatus) => {
      const index = prevStatus.findIndex((s) => s.name === itemName);
      if (index >= 0) {
        return prevStatus.map((s, i) => (i === index ? { ...s, status: newStatus } : s));
      } else {
        return [...prevStatus, { name: itemName, status: newStatus }];
      }
    });
  };

  return (
    <div className='w-full'>
      {contents && Array.isArray(contents) && (
        <React.Fragment>
          <PathLayers path={path} setPathFunc={changePath} concatComponent />
          <ul className='w-full overflow-clip rounded-lg rounded-t-none border-x border-slate-200'>
            {path !== '' && (
              <BrowserListItem
                item={{ name: `.`, type: 'dir' }}
                itemClickFunc={() => {}}
                downloadFunc={handleDownload}
              />
            )}
            {contents
              .filter((item) => item.type === 'dir')
              .map((item) => (
                <li key={item.path}>
                  <FolderContent
                    item={item}
                    setPathFunc={changePath}
                    updateFunc={(status) => updateStatus(item.path, status)}
                  />
                </li>
              ))}
            {contents
              .filter((item) => item.type === 'file')
              .map((item) => (
                <li key={item.path}>
                  <FileContent item={item} updateFunc={(status) => updateStatus(item.path, status)} />
                </li>
              ))}
          </ul>
        </React.Fragment>
      )}
      <DownloadStatusViewer
        status={status}
        deleteFunc={(name: string) => {
          const filteredStatus = status.filter((item) => item.name !== name);
          setStatus(filteredStatus);
        }}
      />
    </div>
  );
}
