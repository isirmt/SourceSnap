import { GitHubReposContext } from "@/types/GitHubReposContext"

export default function BrowserListItem({ item, itemClickFunc, downloadFunc }:
  {
    item: GitHubReposContext,
    itemClickFunc: () => void,
    downloadFunc: () => void,
  }) {
  return <div className="flex w-full text-base border-y mb-[-1px] border-slate-200 justify-between group hover:bg-blue-100">
    <button onClick={itemClickFunc} className="text-left py-1.5 px-2 size-full group-hover:bg-blue-100" >
      <span className={`${item.type === "file" ? "i-tabler-file-filled" : "i-tabler-folder-filled"} translate-y-1 mr-1`} />
      {item.name}
    </button>
    <div className="p-0.5 flex gap-0.5">
      <button onClick={() => window.open(item.html_url!)} title="Open with GitHub" className="transition-colors bg-white text-gray-500 border-gray-500 border rounded hover:bg-gray-500 hover:text-white h-full px-1.5 flex justify-center items-center">
        <div className="i-tabler-brand-github size-5" />
      </button>
      <button onClick={downloadFunc} title="Download" className="transition-colors bg-white text-blue-500 border-blue-500 border rounded hover:bg-blue-500 hover:text-white h-full px-1.5 flex justify-center items-center">
        <div className="i-tabler-download size-5" />
      </button>
    </div>
  </div>
}