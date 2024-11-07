import { GitHubReposContext } from "@/types/GitHubReposContext";
import Link from "next/link";

export default function FileContext({ item }: { item: GitHubReposContext }) {
  return <Link href={item.download_url!} >
    <div className="w-full p-0.5">
      {item.name}
    </div>
  </Link>
}