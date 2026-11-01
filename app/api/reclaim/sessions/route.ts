import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/reclaim/server';
import { ownerCookie } from '@/lib/reclaim/config';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  let sameOrigin = false;
  try {
    const url = new URL(origin ?? '');
    // Next's internal URL can normalize 127.0.0.1 to localhost in development.
    sameOrigin = url.host === request.headers.get('host') && url.protocol === request.nextUrl.protocol;
  } catch { /* Reject missing or malformed browser origins. */ }
  if (!sameOrigin) {
    return NextResponse.json({ error: 'Please start verification from this website.' }, { status: 403 });
  }
  const existingOwner = request.cookies.get(ownerCookie)?.value;
  const owner = existingOwner && /^[\w-]{43}$/.test(existingOwner) ? existingOwner : randomBytes(32).toString('base64url');
  try {
    const session = await createSession(owner);
    const response = NextResponse.json(session, { status: 201, headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(ownerCookie, owner, {
      httpOnly: true, sameSite: 'lax', secure: request.nextUrl.protocol === 'https:', path: '/', maxAge: 86400,
    });
    return response;
  } catch (error) {
    console.error('Could not create Reclaim session', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ error: 'Verification could not be started. Please try again shortly.' }, { status: 503 });
  }
}
