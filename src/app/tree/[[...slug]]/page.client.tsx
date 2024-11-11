'use client';

import SessionReduxWrapper from '@/components/common/SessionReduxWrapper';
import RepoContentFetcher from '@/components/tree/TreeBrowser';
import { DefaultTree } from '@/types/GitHubDefaultTree';

export default function ListPageClient({ defaultTree }: { defaultTree?: DefaultTree }) {
  return (
    <SessionReduxWrapper>
      <RepoContentFetcher defaultTree={defaultTree} />
    </SessionReduxWrapper>
  );
}
