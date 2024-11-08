'use client'
import { RootState } from "@/lib/github/tokenManager";
import { GitHubReposContext } from "@/types/GitHubReposContext";
import saveAs from "file-saver";
import Link from "next/link";
import { useSelector } from "react-redux";
import BrowserListItem from "./BrowserListItem";

export default function FileContext({ item }: { item: GitHubReposContext }) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleDownload = async () => {
    if (!accessToken) {
      alert("アクセストークンが設定されていません");
      return;
    }
    try {
      if (item.download_url) {
        const response = await fetch(`/api/get-file?download_url=${encodeURIComponent(item.download_url)}`);

        if (!response.ok) {
          throw new Error('Failed to download file');
        }

        const blob = await response.blob();
        console.log(blob);

        saveAs(blob, item.name);
      } else {
        throw new Error("File does not have a download URL.");
      }
    } catch (error) {
      console.error("ファイルのダウンロードに失敗しました:", error);
    }
  };

  return <BrowserListItem>
    <Link target="_blank" rel="noopener noreferrer" href={item.html_url!} className="py-1 px-2 size-full hover:bg-blue-100" >
      <span className="i-tabler-file-filled translate-y-1 mr-1" />
      {item.name}
    </Link>
    <div>
      <button onClick={handleDownload} title="Download This File" className="text-white bg-blue-500 h-full px-2">
        <div className="i-tabler-download" />
      </button>
    </div>
  </BrowserListItem>
}
