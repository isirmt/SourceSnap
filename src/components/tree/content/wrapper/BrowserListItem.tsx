import { GitHubReposContext } from '@/types/GitHubReposContext';

export type ListItem = {
  name: string;
  html_url?: string;
  type: 'dir' | 'file' | 'submodule' | 'symlink';
};

export default function BrowserListItem({
  item,
  itemClickFunc,
  downloadFunc,
}: {
  item: GitHubReposContext | ListItem;
  itemClickFunc: () => void;
  downloadFunc: () => void;
}) {
  return (
    <div className='group mb-[-1px] flex w-full justify-between border-y border-slate-200 text-base hover:bg-blue-100'>
      <button onClick={itemClickFunc} className='size-full px-2 py-1.5 text-left group-hover:bg-blue-100'>
        <span className={`${item.type === 'file' ? 'i-tabler-file' : 'i-tabler-folder-filled'} mr-1 translate-y-1`} />
        {item.name}
      </button>
      <div className='flex gap-0.5 p-0.5'>
        {item.html_url && (
          <button
            onClick={() => window.open(item.html_url!)}
            title='Open with GitHub'
            className='flex h-full items-center justify-center rounded border border-gray-500 bg-white px-1.5 text-gray-500 transition-colors hover:bg-gray-500 hover:text-white'
          >
            <div className='i-tabler-brand-github size-5' />
          </button>
        )}
        <button
          onClick={downloadFunc}
          title='Download'
          className='flex h-full items-center justify-center rounded border border-blue-500 bg-white px-1.5 text-blue-500 transition-colors hover:bg-blue-500 hover:text-white'
        >
          <div className='i-tabler-download size-5' />
        </button>
      </div>
    </div>
  );
}
