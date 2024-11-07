import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const downloadUrl = searchParams.get('download_url');
  const token = searchParams.get('token');

  if (!downloadUrl || !token) {
    return NextResponse.json({ error: 'Missing download_url or token' }, { status: 400 });
  }

  try {
    const response = await fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch the file: ${response.statusText}`);
    }

    const fileBlob = await response.blob();

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
