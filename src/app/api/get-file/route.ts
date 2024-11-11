import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session: Session | null = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const downloadUrl = searchParams.get('download_url');

  if (!downloadUrl) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const octokit = new Octokit({
      auth: session.access_token,
    });

    const response = await octokit.request('GET ' + downloadUrl);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch the file: ${response.status}`);
    }

    const fileBlob = Buffer.from(response.data);

    return new NextResponse(fileBlob, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="downloaded_file"`,
      },
    });
  } catch (error) {
    console.error('Error fetching the file:', error);
    return NextResponse.json({ error: 'Error Occurred' }, { status: 500 });
  }
}
