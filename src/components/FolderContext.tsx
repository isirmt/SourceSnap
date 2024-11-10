'use client'
import { GitHubReposContext } from "@/types/GitHubReposContext";
import BrowserListItem from "./BrowserListItem";
import saveAs from "file-saver";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/github/tokenManager";

export default function FolderContext({ item, setPathFunc }: { item: GitHubReposContext; setPathFunc: (path: string) => void }) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleDownload = async () => {
    const { owner, repo } = parseGitHubUrl(item.url)
    if (!accessToken) {
      alert("No access token is set");
      return;
    }
    try {
      const response = await fetch(`/api/get-folder?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&path=${item.path}`);

      if (!response.ok) {
        throw new Error('Failed to download folder');
      }

      const blob = await response.blob();
      console.log(blob);
      saveAs(blob, item.name);
    } catch {
      throw new Error("File does not have a download URL.");
    }
  };

  return <BrowserListItem
    item={item}
    itemClickFunc={() => setPathFunc(item.path)}
    downloadFunc={handleDownload}
  />
}

function parseGitHubUrl(url: string) {
  const regex = /https:\/\/api\.github\.com\/repos\/([^\/]+)\/([^\/]+)\/contents\/([^?]+)/;
  const match = url.match(regex);

  if (!match) {
    throw new Error('Invalid GitHub API URL format');
  }

  const owner = match[1];
  const repo = match[2];
  const path = match[3];

  return { owner, repo, path };
}