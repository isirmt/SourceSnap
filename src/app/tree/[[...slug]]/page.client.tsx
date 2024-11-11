'use client';

import SessionReduxWrapper from '@/components/SessionReduxWrapper';
import RepoContentFetcher from '@/components/TreeBrowser';
import { DefaultTree } from '@/types/GitHubDefaultTree';

export default function ListPageClient({ defaultTree }: { defaultTree?: DefaultTree }) {
  return (
    <SessionReduxWrapper>
      <RepoContentFetcher defaultTree={defaultTree} />
    </SessionReduxWrapper>
  );
}
