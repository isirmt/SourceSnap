import React from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { Session } from 'next-auth';
import SessionButton from '@/components/common/fragment/SessionButton';
import TreeSection from '@/components/tree/TreeSection';
import { generateMetadataTemplate } from '@/lib/SEO';
import { auth, signIn } from '@/lib/auth';
import ListPageClient from './page.client';

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const [owner, repo] = (await params).slug ?? [];
  return generateMetadataTemplate({
    title: owner && repo ? `${owner}/${repo}` : undefined,
  });
}

export default async function ListPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const session: Session | null = await auth();
  if (!session) {
    await signIn(undefined, {
      redirectTo: new URL((await headers()).get('x-url')!).toString(),
    });
    return (
      <Main>
        <TreeSection>
          <div>Need to login</div>
          <SessionButton />
        </TreeSection>
      </Main>
    );
  }

  const accessToken = session.access_token;

  if (!accessToken) {
    return (
      <Main>
        <TreeSection>
          <div>Failed to get access token</div>
          <SessionButton />
        </TreeSection>
      </Main>
    );
  }

  const [owner, repo, ...pathSegments] = (await params).slug ?? [];
  const path = pathSegments.join('/');

  const ref = (await searchParams)['ref'];

  return (
    <Main>
      <ListPageClient
        defaultTree={{
          owner,
          repo,
          path,
          ref: ref !== '' ? ref : undefined,
        }}
      />
    </Main>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return <main className='p-4'>{children}</main>;
}
