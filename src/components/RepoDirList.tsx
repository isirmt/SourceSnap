import React, { useState } from 'react';
import { GitHubReposContext } from '@/types/GitHubReposContext';
import FolderContext from './FolderContext';
import FileContext from './FileContext';
import PathLayers from './PathLayers';
import DownloadStatusViewer from './DownloadStatusViewer';
import { DownloadStatus, DownloadStatusData } from '@/types/DownloadStatus';

interface RepoContentsProps {
  contents: GitHubReposContext[] | undefined;
  owner: string;
  repo: string;
  path: string;
  changePath: (updatedPath: string) => void;
}

export default function RepoDirList({ contents, owner, repo, path, changePath }: RepoContentsProps) {
  const [status, setStatus] = useState<DownloadStatusData[]>([]);

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
    <div className='max-w-full w-[40rem]'>
      {contents && Array.isArray(contents) && (
        <React.Fragment>
          <PathLayers path={path} setPathFunc={changePath} concatComponent />
          <ul className='w-full border-x border-slate-200 rounded-lg rounded-t-none overflow-clip'>
            {contents.filter(item => item.type === "dir").map(item => (
              <li key={item.path}>
                <FolderContext item={item} setPathFunc={changePath} updateFunc={(status) => updateStatus(item.path, status)} />
              </li>
            ))}
            {contents.filter(item => item.type === "file").map(item => (
              <li key={item.path}>
                <FileContext item={item} updateFunc={(status) => updateStatus(item.path, status)} />
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
};
