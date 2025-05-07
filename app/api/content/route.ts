import { NextResponse } from 'next/server';
import { createDbClient } from '@/db';
import { put } from '@vercel/blob';

export async function GET() {
  const client = createDbClient();
  try {
    await client.connect();
    const { rows } = await client.query(
      "SELECT * FROM content WHERE label IN ('homeheading', 'homeimage')"
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const content = rows.reduce((acc, row) => {
      acc[row.label] = row.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
      }

      const filename = file.name;

      const blob = await put(filename, file, {
        access: 'public',
        allowOverwrite: true,
      });

      return NextResponse.json({ url: blob.url, filename });
    } catch (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
  }

  const client = createDbClient();
  try {
    const { label, value } = await req.json();

    if (!label || typeof value !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await client.connect();
    const result = await client.query(
      'UPDATE content SET value = $1 WHERE label = $2',
      [value, label]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  } finally {
    await client.end();
  }
}