import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import JSZip from 'jszip';
import { GitHubReposContext } from '@/types/GitHubReposContext';

async function getFolderContents(octokit: Octokit, owner: string, repo: string, path: string): Promise<GitHubReposContext[]> {

  const contents = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  if (contents && Array.isArray(contents.data)) {
    const files: GitHubReposContext[] = [];
    for (const item of contents.data) {
      if (item.type === 'file') {
        files.push(item);
      } else if (item.type === 'dir') {
        const subfolderFiles = await getFolderContents(octokit, owner, repo, item.path);
        files.push(...subfolderFiles);
      }
    }

    return files;
  } else return []
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const token = searchParams.get('token');
  const path = searchParams.get('path');

  if (!owner || !repo || !token || !path) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const octokit = new Octokit({ auth: token });

    const files = await getFolderContents(octokit, owner, repo, path);

    const zip = new JSZip();

    for (const file of files) {
      const fileContent = await octokit.request('GET ' + file.download_url);

      zip.file(file.path, fileContent.data);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    return new NextResponse(zipBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${repo}.zip"`,
      },
    });

  } catch (error) {
    console.error('Error fetching the file:', error);
    return NextResponse.json({ error: "Error Occurred" }, { status: 500 });
  }
}
