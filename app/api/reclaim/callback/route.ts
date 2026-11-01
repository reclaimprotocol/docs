import { NextRequest, NextResponse } from 'next/server';
import { receiveCallback } from '@/lib/reclaim/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  try {
    const status = await receiveCallback(body);
    return NextResponse.json({ received: status === 200 }, { status });
  } catch {
    console.error('Reclaim callback processing failed; delivery should be retried');
    return NextResponse.json({ received: false }, { status: 503 });
  }
}
