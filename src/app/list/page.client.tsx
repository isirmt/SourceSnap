'use client'

import SessionReduxWrapper from "@/components/SessionReduxWrapper"
import RepoContentFetcher from "@/components/TreeBrowser"

export default function ListPageClient() {
  return (
    <SessionReduxWrapper>
      <RepoContentFetcher />
    </SessionReduxWrapper>
  )
}