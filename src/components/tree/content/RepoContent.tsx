'use client';
export default function RepoContent({
  owner,
  repo,
  onSelectRepo,
}: {
  owner: string;
  repo: string;
  onSelectRepo: () => void;
}) {
  return (
    <div className='group mb-[-1px] flex w-full justify-between border-y border-slate-200 text-base hover:bg-blue-100'>
      <button onClick={onSelectRepo} className='size-full px-2 py-1.5 text-left group-hover:bg-blue-100'>
        <span className={`i-tabler-brand-github mr-1 translate-y-1`} />
        {owner}/{repo}
      </button>
    </div>
  );
}
