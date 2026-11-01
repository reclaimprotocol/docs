import { NextRequest, NextResponse } from 'next/server';
import { getStatus } from '@/lib/reclaim/server';
import { ownerCookie } from '@/lib/reclaim/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    const state = await getStatus(sessionId, request.cookies.get(ownerCookie)?.value);
    return NextResponse.json(state ?? { error: 'This verification could not be found. Please start again.' }, {
      status: state ? 200 : 404, headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'We could not check your verification. Please try again.' }, { status: 503 });
  }
}
