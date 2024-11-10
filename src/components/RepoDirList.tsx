import React from 'react';
import { GitHubReposContext } from '@/types/GitHubReposContext';
import FolderContext from './FolderContext';
import FileContext from './FileContext';
import PathLayers from './PathLayers';

interface RepoContentsProps {
  contents: GitHubReposContext[] | undefined;
  path: string;
  changePath: (updatedPath: string) => void;
}

export default function RepoDirList({ contents, path, changePath }: RepoContentsProps) {
  return (
    <div className='max-w-full w-[40rem]'>
      {contents && Array.isArray(contents) && (
        <React.Fragment>
          <PathLayers path={path} setPathFunc={changePath} concatComponent />
          <ul className='w-full border-x border-slate-200 rounded-lg rounded-t-none overflow-clip'>
            {contents.filter(item => item.type === "dir").map(item => (
              <li key={item.path}>
                <FolderContext item={item} setPathFunc={changePath} />
              </li>
            ))}
            {contents.filter(item => item.type === "file").map(item => (
              <li key={item.path}>
                <FileContext item={item} />
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
    </div>
  );
};
