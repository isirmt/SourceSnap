'use client'
import { RootState } from "@/lib/github/tokenManager";
import { GitHubReposContext } from "@/types/GitHubReposContext";
import saveAs from "file-saver";
import { useSelector } from "react-redux";
import BrowserListItem from "./BrowserListItem";

export default function FileContext({ item }: { item: GitHubReposContext }) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleDownload = async () => {
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
        console.log(blob);

        saveAs(blob, item.name);
      } else {
        throw new Error("File does not have a download URL.");
      }
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  return <BrowserListItem
    item={item}
    itemClickFunc={() => window.open(item.html_url!, '_blank', 'noopener,noreferrer')}
    downloadFunc={handleDownload}
  />
}
