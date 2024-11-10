'use client'
import { RootState } from "@/lib/github/tokenManager";
import { GitHubReposContext } from "@/types/GitHubReposContext";
import saveAs from "file-saver";
import { useSelector } from "react-redux";
import BrowserListItem from "./BrowserListItem";
import { DownloadStatus } from "@/types/DownloadStatus";

interface FileContextProps {
  item: GitHubReposContext;
  updateFunc: (status: DownloadStatus) => void;
}

export default function FileContext({ item, updateFunc: updateStatus }: FileContextProps) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleDownload = async () => {
    updateStatus('downloading');
    if (!accessToken) {
      alert("No access token is set");
      return;
    }
    try {
      if (item.download_url) {
        const response = await fetch(`/api/get-file?download_url=${encodeURIComponent(item.download_url)}`);
        if (!response.ok) {
          throw new Error('Failed to download file');
        }
        const blob = await response.blob();
        saveAs(blob, item.name);
        updateStatus('completed');
      } else {
        throw new Error("File does not have a download URL.");
      }
    } catch (error) {
      console.error("Failed to download file:", error);
      updateStatus('error');
    }
  };

  return <BrowserListItem
    item={item}
    itemClickFunc={() => window.open(item.html_url!, '_blank', 'noopener,noreferrer')}
    downloadFunc={handleDownload}
  />;
}
