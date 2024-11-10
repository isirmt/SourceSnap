'use client'
export default function RepoContext({ owner, repo, onSelectRepo }: { owner: string; repo: string; onSelectRepo: () => void}) {
  return <div className="flex w-full text-base border-y mb-[-1px] border-slate-200 justify-between group hover:bg-blue-100">
    <button onClick={onSelectRepo} className="text-left py-1.5 px-2 size-full group-hover:bg-blue-100" >
      <span className={`i-tabler-brand-github translate-y-1 mr-1`} />
      {owner}/{repo}
    </button>
  </div>
}