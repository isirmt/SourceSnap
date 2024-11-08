import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const downloadUrl = searchParams.get('download_url');
  const token = searchParams.get('token');

  if (!downloadUrl || !token) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const octokit = new Octokit({
      auth: token,
    });

    const response = await octokit.request('GET ' + downloadUrl);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch the file: ${response.status}`);
    }

    const fileBlob = Buffer.from(response.data);

    return new NextResponse(fileBlob, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="downloaded_file"`
      },
    });

  } catch (error) {
    console.error('Error fetching the file:', error);
    return NextResponse.json({ error: "Error Occurred" }, { status: 500 });
  }
}
