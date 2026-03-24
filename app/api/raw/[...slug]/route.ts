import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const slugPath = slug.join('/');

  // Try both index.mdx and direct .mdx file
  const contentDir = path.join(process.cwd(), 'content', 'docs');
  const candidates = [
    path.join(contentDir, `${slugPath}.mdx`),
    path.join(contentDir, slugPath, 'index.mdx'),
  ];

  for (const filePath of candidates) {
    // Prevent path traversal
    if (!filePath.startsWith(contentDir)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    try {
      const content = await readFile(filePath, 'utf-8');
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
        },
      });
    } catch {
      // Try next candidate
    }
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
