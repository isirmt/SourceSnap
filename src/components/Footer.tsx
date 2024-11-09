import Link from "next/link";

export default async function Footer() {
  return <footer className="w-full text-center items-center justify-center flex flex-col py-8 border-t border-slate-300 bg-slate-100">
    <div className="text-sm">&copy; isirmt</div>
    <div>
      <Link target="_blank" rel="noopener noreferrer"
        className="underline"
        href="https://github.com/isirmt/TreeDownloader">
        src on GitHub
      </Link>
    </div>
  </footer>
}