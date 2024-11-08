export default function BrowserListItem({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full text-base border justify-between">
    {children}
  </div>
}